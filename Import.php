<?php
global $wpdb;
$csvdata = file_get_contents(__DIR__.'/scores.csv');
$lines = explode("\n", $csvdata); // split data by new lines
foreach ($lines as $i => $line) {
    $values = explode(',', $line); // split lines by commas

    $user = trim($values[0]);
    $reviewed = 1;
    if(false && $user != "uid"){
        for($k = 1; $k < 14; $k++) {
            $year = 2018;
            $month = $k + 6;
            if($month > 12) {
                $month = $month - 12;
                $year = 2019;
            }
            if($values[$k]) {
                $score = $values[$k];
                echo "Inserting [$user] [$year] [$month] [$score] [$reviewed]<br/>";
                $sql = $wpdb->prepare( "REPLACE INTO wp_rhythmus_kra_review
                    (user_id, year, month, total, reviewed, review_notes, last_update_date)
                    VALUES
                    (%d, %d, %d, %f, %d, %s, now())",
                    $user, $year, $month, $score, 
                    $reviewed, ""
                    );
                $wpdb->query($sql);
            }
        }

    }
}
$csv = array_map('str_getcsv', file(__DIR__.'/aaron.csv'));

foreach ($csv as $i => $line) {
    $values = $line;

    $user = 1;
    $reviewed = 1;
    if(true && $values[0] != "month" ){
        $month = $values[0];
        $year = $values[1];
        $score = $values[9];
        $topics = array(
            "kra"=>array(
                "score"=>$values[2],
            ),
            "work"=>array(
                "score"=>$values[4],
                "goal"=>$values[3]
            ),
            "education"=>array(
                "score"=>$values[6],
                "goal"=>$values[5]
            ),
            "character"=>array(
                "score"=>$values[8],
                "goal"=>$values[7]
            ),
        );
        if(doubleval($score)>0){
            $reviewed = 1;
        } else {
            $reviewed = 0;
        }
        $topics = json_encode($topics);
        echo "Inserting [$user] [$year] [$month] [$score] [$reviewed] [$topics]<br/>";
        $sql = $wpdb->prepare( "REPLACE INTO wp_rhythmus_kra_review
            (user_id, year, month, total, reviewed, review_notes, last_update_date, topics)
            VALUES
            (%d, %d, %d, %f, %d, %s, now(), %s)",
            $user, $year, $month, $score, 
            $reviewed, "", $topics
            );
        $wpdb->query($sql);

    }
}

