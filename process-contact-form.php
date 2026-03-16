<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed']);
  exit;
}
function clean($value) { return trim(strip_tags((string)$value)); }
$honeypot = clean($_POST['company'] ?? '');
if ($honeypot !== '') {
  echo json_encode(['success' => true, 'message' => 'Thanks. Your message has been sent.']);
  exit;
}
$first = clean($_POST['firstName'] ?? '');
$last = clean($_POST['lastName'] ?? '');
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone = clean($_POST['phone'] ?? '');
$topic = clean($_POST['topic'] ?? 'General question');
$message = trim((string)($_POST['message'] ?? ''));
if ($first === '' || $last === '' || !$email || $message === '') {
  http_response_code(422);
  echo json_encode(['success' => false, 'message' => 'Please complete all required fields.']);
  exit;
}
$to = 'info@springvalleydentistry.com';
$subject = 'Website inquiry from ' . $first . ' ' . $last;
$body = "Name: {$first} {$last}
Email: {$email}
Phone: {$phone}
Topic: {$topic}

{$message}
";
$headers = [
  'From: Spring Valley Dental Associates <noreply@springvalleydentistry.com>',
  'Reply-To: ' . $first . ' ' . $last . ' <' . $email . '>'
];
$sent = @mail($to, $subject, $body, implode("
", $headers));
if ($sent) {
  echo json_encode(['success' => true, 'message' => 'Thanks. Your message has been sent and our team will follow up soon.']);
} else {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'We could not send your message right now. Please call (972) 852-2222.']);
}
