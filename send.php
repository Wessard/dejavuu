<?
$token="6050564304:AAEXlKAPNt0xjisRZGPTE8MwKRDdNiN1770";
$chat_id="743050154";


$name=$_POST['name'];
$fname=$_POST['fname'];

$arr=array(
    'Имя пользователя: '=>$name,
    'Фамилия пользователя: '=>$fname,
);
foreach($arr as $key => $value){
    $txt .= $key." ".$value."%0A";
}
$ch = curl_init('https://api.telegram.org/bot'.$token.'/sendMessage?chat_id='.$chat_id.'&text='.$txt); // URL
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Не возвращать ответ
curl_exec($ch); // Делаем запрос
curl_close($ch); // Завершаем сеанс cURL
?>