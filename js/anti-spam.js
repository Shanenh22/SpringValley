/**
 * anti-spam.js — Client-side anti-spam utilities for Spring Valley Dental forms.
 *
 * Exports window.AntiSpam with:
 *   AntiSpam.init(formEl)     — sets honeypot + fill-time tracking
 *   AntiSpam.check(formEl)    — returns { ok, reason } before submit
 *   AntiSpam.rateLimit(key)   — returns true if too many recent submissions
 *   AntiSpam.mathChallenge()  — returns { question, answer } for a simple CAPTCHA
 */
(function (global) {
  'use strict';

  var AntiSpam = {};

  /**
   * Initialize anti-spam fields on a form.
   * Expects a hidden honeypot input (#company or [name="company"])
   * and a hidden start-time input (#startTime or [name="startTime"]).
   */
  AntiSpam.init = function (form) {
    if (!form) return;
    var hp    = form.querySelector('#company, [name="company"]');
    var start = form.querySelector('#startTime, [name="startTime"]');
    if (start) start.value = Date.now().toString();
    // Clear honeypot just in case autofill touched it
    if (hp) hp.value = '';
  };

  /**
   * Check form for spam signals.
   * @returns {{ ok: boolean, reason: string }}
   */
  AntiSpam.check = function (form, minFillMs) {
    minFillMs = minFillMs || 5000;
    var hp    = form && form.querySelector('#company, [name="company"]');
    var start = form && form.querySelector('#startTime, [name="startTime"]');

    // Honeypot filled → bot
    if (hp && hp.value) return { ok: false, reason: 'honeypot' };

    // Filled too fast → bot
    var elapsed = start ? (Date.now() - Number(start.value || 0)) : Infinity;
    if (elapsed < minFillMs) return { ok: false, reason: 'too_fast' };

    return { ok: true, reason: '' };
  };

  /**
   * Simple client-side rate limit using localStorage.
   * @param {string} key   — unique storage key per form
   * @param {number} max   — max submissions per window (default 3)
   * @param {number} windowMs — sliding window in ms (default 1 hour)
   * @returns {boolean} true if limit exceeded
   */
  AntiSpam.rateLimit = function (key, max, windowMs) {
    max      = max      || 3;
    windowMs = windowMs || 60 * 60 * 1000;
    try {
      var now = Date.now();
      var arr = JSON.parse(localStorage.getItem(key) || '[]')
                  .filter(function (t) { return now - t < windowMs; });
      if (arr.length >= max) return true;
      arr.push(now);
      localStorage.setItem(key, JSON.stringify(arr));
      return false;
    } catch (e) {
      return false; // if localStorage unavailable, allow
    }
  };

  /**
   * Generate a simple math challenge.
   * @returns {{ question: string, answer: number }}
   */
  AntiSpam.mathChallenge = function () {
    var a = Math.floor(3 + Math.random() * 7);
    var b = Math.floor(2 + Math.random() * 8);
    return { question: a + ' + ' + b + ' = ?', answer: a + b };
  };

  global.AntiSpam = AntiSpam;
})(window);
