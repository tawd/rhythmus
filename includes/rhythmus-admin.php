<?php

function rhythmus_get_wp_user_chooser($userArr, $selected){
    $chooser = "<select name='wp_user_id'><option value=''>Choose...</option>";
    foreach ($userArr as $user) {
        $chooser.= "<option value='".$user->ID."'";
        if($selected == $user->ID) {
            $chooser.= " selected";
        }
        $chooser.=">".$user->user_email."</option>";
    }
    $chooser .= "</select>";
    return $chooser;
}
function rhythmus_show_admin() {
    global $wpdb;


    //This is a hack job, handle the post of saving data here
    if($_POST["fname"]){
        $sql = $wpdb->prepare( "REPLACE INTO {$wpdb->prefix}rhythmus_teammate
                (`id`, `wp_user_id`, `fname`, `lname`, `slack`, `is_active`)
                VALUES
                (%d, %d, %s, %s, %s, %d )",
			    $_POST['id'], $_POST['wp_user_id'], $_POST['fname'], $_POST['lname'], $_POST['slack'], $_POST['is_active']
		);

		if ( ! $wpdb->query( $sql ) ) {
			echo "<h2 style='color:red'>Error Saving</h2>";
        }
        else {
            echo "Updated ".$_POST["fname"]."<br/>";
        }
    }


    $userArr = $wpdb->get_results( "SELECT `ID`, `user_email` FROM {$wpdb->prefix}users ORDER BY user_email asc", OBJECT );

    $results = $wpdb->get_results( "SELECT `id`, `wp_user_id`, `fname`, `lname`, `slack`, `is_active` 
    FROM {$wpdb->prefix}rhythmus_teammate ORDER BY fname asc, lname ASC", OBJECT );

    ?>
    <table>
        <tr><td>First Name</td><td>Last Name</td><td>Slack User Name</td><td>WordPress User</td><td>Is Active</td><td>&nbsp;</tr>
        <tr><form method='post'><td><input type='text' name='fname' /></td>
        <td><input type='text' name='lname' /></td>
        <td><input type='text' name='slack' /></td>
        <td><?php echo rhythmus_get_wp_user_chooser($userArr, ""); ?></td>
        <td><input type='checkbox' name='is_active' value='1' checked /></td>
        <td><input type='submit' value='Add'/></td></form></tr>
        <?php

    foreach ( $results as $row ) {

        echo "<tr><form method='post'>";
        echo "<td><input type='hidden' name='id' value='".$row->id."'/><input type='text' name='fname' value='".$row->fname."'/></td>";
        echo "<td><input type='text' name='lname' value='".$row->lname."'/></td>";
        echo "<td><input type='text' name='slack' value='".$row->slack."'/></td>";
        echo "<td>".rhythmus_get_wp_user_chooser($userArr, $row->wp_user_id)."</td>";
        echo "<td><input type='checkbox' value='1' name='is_active' ";
        if($row->is_active){echo " checked";}
        echo "/></td>";

        echo "<td><input type='submit' value='Save'/></td></form></tr>";
    }
    ?>
    </table><?php

}
