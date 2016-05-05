<?php
exit;

ini_set('display_errors', 'on');
error_reporting(E_ALL);
	
$subject = 'Contact form Fresh Cash';
$message = '<!DOCTYPE html><html><head></head><body><h1>Contact form Кредитор</h1><b>Ваше ФИО</b>: test<br /><br /><b>Ваш email</b>: alex21124@bk.ru<br /><br /><b>Текст сообщения</b>: trst<br /><br /></body></html>';


require './protected/extensions/PHPMailer5/phpmailer.php';

$mail = new PHPMailer;
$mail->CharSet = "UTF-8";

//$mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->setFrom('info@fclombards.lv', 'Fresh Cash');
$mail->addReplyTo('info@fclombards.lv', 'Fresh Cash');
$mail->addAddress('karasmg@gmail.com');
$mail->addAddress('karasmg@za.pe.hu');

/*
$mail->addAddress('administrator@kredytor.com.ua');
$mail->addAddress('web@skarb.com.ua');
*/
$mail->isHTML(true);

$mail->Subject = $subject;
$mail->Body    = $message;

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}