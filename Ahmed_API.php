<?php
require_once__DIR__. '/config.php';
class API {
    function Select(){
        $db = new connect;
        $users = array();
        $data = $db ->prepare('SELECT * FROM users ORDER BY id');
        $data ->execute();
        while($OutputData = $data->fetch(PDO::FETCH_ASSOC)){
            $users[$OutputData['id']] = array(
                `teammate_id` => $outputData[`teammate_id`],
                `year` => $outputData[`year`],
                `month` => $outputData[`month`]
            );
        }
        return json_encode($users);
    }
}

$API = new API;
header('Content-Type: application/json');
echo $API->Select();
?>
