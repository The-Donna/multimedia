<?php
// Database config
$host = 'localhost';
$db   = 'complaint_db';      // Make sure this matches your database
$user = 'root';              // Replace with your MySQL username
$pass = '';                  // Replace with your MySQL password if needed

// Connect to MySQL
$conn = new mysqli($host, $user, $pass, $db);

// Connection check
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
    exit();
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name      = trim($_POST['name'] ?? '');
    $email     = trim($_POST['email'] ?? '');
    $complaint = trim($_POST['complaint'] ?? '');

    // Basic validation
    if (empty($name) || empty($email) || empty($complaint)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit();
    }

    // Prepare and insert
    $stmt = $conn->prepare("INSERT INTO complaints (name, email, complaint) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $complaint);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Complaint submitted successfully.']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Error submitting complaint.']);
    }

    $stmt->close();
    $conn->close();
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
