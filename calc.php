<?php


if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $post = json_decode(file_get_contents("php://input"));
    // foreach($post as $key=>$item ) {
    //var_dump($post);
    // }
    echo "куку";
    exit;
}
echo 'rtg';
exit;
if(verify($_POST['g-recaptcha-response']))
    sendEmail($_POST['email']);

function createPdf(){

}

function sendEmail($mailAddr){
    require './mailer/EMailer.php';

    $mail = new EMailer;
    $mail->CharSet = "UTF-8";

    $subject = 'Расчет на сайте procenko.com.ua';
    $message = '<!DOCTYPE html><html><head></head><body><h1>Contact form Кредитор</h1><b>Ваше ФИО</b>: test<br /><br /><b>Ваш email</b>: alex21124@bk.ru<br /><br /><b>Текст сообщения</b>: trst<br /><br /></body></html>';


    $mail->setFrom('info@procenko.com.ua', 'Procenko');
    $mail->addReplyTo('info@procenko.com.ua', 'Procenko');
    $mail->addAddress($mailAddr);
    $mail->addAddress('karasmg@za.pe.hu');

    $mail->isHTML(true);

    $mail->Subject = $subject;
    $mail->Body    = $message;
    if(!$mail->send()) {
        echo 'Message could not be sent.';
        echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        echo 'Message has been sent';
    }
    echo 'Сообщение успешно отправлено';
}

function verify( $response_token ) {
    $is_human = false;

    if ( empty( $response_token ) ) {
        return $is_human;
    }

    $url = 'https://www.google.com/recaptcha/api/siteverify';
    $sitekey = $this->get_sitekey();
    $secret = $this->get_secret( $sitekey );

    $response = wp_safe_remote_post( $url, array(
        'body' => array(
            'secret' => $secret,
            'response' => $response_token,
            'remoteip' => $_SERVER['REMOTE_ADDR'] ) ) );

    if ( 200 != wp_remote_retrieve_response_code( $response ) ) {
        return $is_human;
    }

    $response = wp_remote_retrieve_body( $response );
    $response = json_decode( $response, true );

    $is_human = isset( $response['success'] ) && true == $response['success'];
    return $is_human;
}

function _request($url, $req) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, '');
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $req);
    $res = curl_exec($ch);

    if (curl_errno($ch) != 0 || !in_array(curl_getinfo($ch, CURLINFO_HTTP_CODE), array(200, 401))) {
        throw new Exception('Ошибка отправки запроса');
    };
    curl_close($ch);
    return $res;
}