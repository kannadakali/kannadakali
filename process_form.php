<?php
// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the user's name from the form
    $userName = $_POST["userName"];
   
    // Email address to send the data
    $to = "pranav.gunhal@gmail.com";
   
    // Subject for the email
    $subject = "New Quiz Submission";
   
    // Compose the email message
    $message = "User Name: $userName\n";  // You can add more data here
  
    // Send the email
    if (mail($to, $subject, $message)) {
        echo "Form submission successful!";
    } else {
        echo "Form submission failed. Please try again later.";
    }
}
?>
