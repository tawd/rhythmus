<?php namespace Rhythmus;


/**
 * Class Rhythmus_Install
 * @package Rhythmus
 */
class Rhythmus_Install
{

    public static function rhythmus_install () {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();
        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

        $table_name = $wpdb->prefix . "rhythmus_kra_review";
        $sql = "CREATE TABLE $table_name (
          teammate_id bigint(20),
          year int(4),
          month int(2),
          create_date datetime default CURRENT_TIMESTAMP,
          last_update_date datetime ON UPDATE CURRENT_TIMESTAMP,
          submit_date datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
          total double default 0,
          submitted tinyint(1) default 0,
          reviewed tinyint(1) default 0,
          review_notes varchar(255),
          topics longtext,
          PRIMARY KEY  (teammate_id, year, month)
            ) $charset_collate;";
        dbDelta( $sql );

        $table_name = $wpdb->prefix . "rhythmus_kra_topic";
        $sql = "CREATE TABLE $table_name (
          id mediumint(9) NOT NULL AUTO_INCREMENT,
          name varchar(50),
          title varchar(100),
          description varchar(255),
          type tinyint(1) default 0,
          source tinyint(1) default 0,
          PRIMARY KEY  (id)
            ) $charset_collate;";
        dbDelta( $sql );

        $table_name = $wpdb->prefix . "rhythmus_kra";
        $sql = "CREATE TABLE $table_name (
          id mediumint(9) NOT NULL AUTO_INCREMENT,
          teammate_id bigint(20),
          is_current tinyint(1) default 0,
          create_date datetime default CURRENT_TIMESTAMP,
          last_update_date datetime ON UPDATE CURRENT_TIMESTAMP,
          position varchar(100),
          kra longtext,
          PRIMARY KEY  (id)
            ) $charset_collate;";
        dbDelta( $sql );

        $table_name = $wpdb->prefix . "rhythmus_teammate";
        $sql = "CREATE TABLE $table_name (
          id mediumint(9) NOT NULL AUTO_INCREMENT,
          wp_user_id mediumint(9),
          fname varchar (100),
          lname varchar (100),
          teammate_data text,
          slack text,
          is_active tinyint(1)  NOT NULL DEFAULT 1, 
          is_super_admin tinyint(1) NOT NULL DEFAULT 0,
          PRIMARY KEY  (id)
            ) $charset_collate;";
        dbDelta( $sql );

        $table_name = $wpdb->prefix . "rhythmus_goal_topic";
        $sql = "CREATE TABLE $table_name (
          id mediumint(9) NOT NULL AUTO_INCREMENT,
          name varchar(50),
          title varchar(100),
          description varchar(255),
          PRIMARY KEY  (id)
            ) $charset_collate;";
        dbDelta( $sql );

        $table_name = $wpdb->prefix . "rhythmus_goal";
        $sql = "CREATE TABLE $table_name (
          id mediumint(9) NOT NULL AUTO_INCREMENT,
          teammate_id bigint(20),
          is_current tinyint(1) default 0,
          create_date date,
          last_update_date datetime ON UPDATE CURRENT_TIMESTAMP,
          mission text,
          goals longtext,
          PRIMARY KEY  (id)
            ) $charset_collate;";
        dbDelta( $sql );

        $table_name = $wpdb->prefix . "rhythmus_weekly_report_question";
        $sql = "CREATE TABLE $table_name (
          id mediumint(9) NOT NULL AUTO_INCREMENT,
          effective_start_date date DEFAULT '0000-00-00' NOT NULL,
          effective_end_date date DEFAULT '0000-00-00' NOT NULL,
          field_type VARCHAR(10),
          field_name VARCHAR(100),
          row_height tinyint(1) DEFAULT 1,
          max_length mediumint(4) DEFAULT 0,
          question TEXT,
          placeholder TEXT,
          tooltip TEXT,
          position tinyint(2),
          required tinyint(1),
          is_active tinyint(1) DEFAULT 1, 
          PRIMARY KEY  (id)
            ) $charset_collate;";
        dbDelta( $sql );

        $table_name = $wpdb->prefix . "rhythmus_weekly_report";
        $sql = "CREATE TABLE $table_name (
          teammate_id mediumint(9) not null,
          week_id mediumint(9) not null,
          report_data text,
          notes text,
          stress tinyint(1),
          morale tinyint(1),
          workload tinyint(1),
          last_save_date datetime ON UPDATE CURRENT_TIMESTAMP,
          submit_date datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
          status tinyint(1) DEFAULT 0,
          type tinyint(1) DEFAULT 1,
          reviewed tinyint(1),
          PRIMARY KEY  (teammate_id, week_id)
            ) $charset_collate;";
        dbDelta( $sql );

        $table_name = $wpdb->prefix . "rhythmus_weekly_report_supervisor_status";
        $sql = "CREATE TABLE $table_name (
          teammate_id mediumint(9) not null,
          supervisor_id mediumint(9) not null,
          week_id mediumint(9) not null,
          status tinyint(1),
          PRIMARY KEY  (teammate_id, supervisor_id, week_id)
            ) $charset_collate;";
        dbDelta( $sql );

        $table_name = $wpdb->prefix . "rhythmus_weekly_report_supervisor_comment";
        $sql = "CREATE TABLE $table_name (
          id mediumint(9) NOT NULL AUTO_INCREMENT,
          week_id mediumint(9) not null,
          teammate_id mediumint(9) not null,
          commentor_id mediumint(9) not null,
          submit_date datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
          PRIMARY KEY  (id)
            ) $charset_collate;";
        dbDelta( $sql );

        $table_name = $wpdb->prefix . "rhythmus_high5";
        $sql = "CREATE TABLE $table_name (
          id mediumint(9) NOT NULL AUTO_INCREMENT,
          teammate_id mediumint(9) not null,
          nominee_id mediumint(9) not null,
          week_id mediumint(9) not null,
          notes text,
          priority tinyint(1) not null default 0,
          selected tinyint(1) not null default 0,
          PRIMARY KEY  (id)
            ) $charset_collate;";
        dbDelta( $sql );
        
        $table_name = $wpdb->prefix . "rhythmus_weekly_report_week";
        $sql = "CREATE TABLE $table_name (
          id mediumint(9) NOT NULL AUTO_INCREMENT,
          start_date date DEFAULT '0000-00-00' NOT NULL,
          end_date date DEFAULT '0000-00-00' NOT NULL,
          num_submitted tinyint(3) DEFAULT 0,
          num_reviewed tinyint(3) DEFAULT 0,
          PRIMARY KEY  (id)
            ) $charset_collate;";
        dbDelta( $sql );

        $table_name = $wpdb->prefix . "rhythmus_supervisor";
        $sql = "CREATE TABLE $table_name (
          id mediumint(9) NOT NULL AUTO_INCREMENT,
          teammate_id mediumint(9),
          supervisor_teammate_id mediumint(9),
          date_added datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
          PRIMARY KEY  (id)
            ) $charset_collate;";
        dbDelta( $sql );

        $db_version = get_option('rhythmus_db_version');
        if(!$db_version) {

            $table_name = $wpdb->prefix . 'rhythmus_kra_topic';

            $wpdb->insert($table_name,
                array(
                    'name' => "kra",
                    'type' => "1",
                    'title' => "Key Results Areas",
                    'description' => 'The areas of your job that when you are doing these successfully, you are winning at work.',
                    'source' => 1
                )
            );
            $wpdb->insert($table_name,
                array(
                    'name' => "work",
                    'title' => "Work Goal",
                    'description' => "A SMART goal for work that has a specific measurement that you can accomplish this month.",
                    'type' => "0"
                )
            );
            $wpdb->insert($table_name,
                array(
                    'name' => "education",
                    'title' => "Education Goal",
                    'description' => "A SMART goal to further your educational growth that has a specific measurement that you can accomplish this month.",
                    'type' => "0"
                )
            );
            $wpdb->insert($table_name,
                array(
                    'name' => "character",
                    'title' => "Character or Discipline",
                    'description' => "A character trait that you will be working on, or a habit that will create discipline in your life to affect your character.",
                    'type' => "1"
                )
            );

            $table_name = $wpdb->prefix . 'rhythmus_weekly_report_question';

            $wpdb->insert($table_name,
                array(
                    'field_type' => "text",
                    'field_name' => "pay",
                    'row_height' => 1,
                    'max_length' => 100,
                    'question' => "How much were you paid this week?",
                    'tooltip' => "",
                    'placeholder' => "$",
                    'position' => 1,
                    'required' => 1
                )
            );
            $wpdb->insert($table_name,
                array(
                    'field_type' => "text",
                    'field_name' => "why",
                    'row_height' => 10,
                    'max_length' => 0,
                    'question' => "Why was it worth it?",
                    'tooltip' => "",
                    'placeholder' => "My pay this week for the work was a great value because...",
                    'position' => 2,
                    'required' => 1
                )
            );
            $wpdb->insert($table_name,
                array(
                    'field_type' => "text",
                    'field_name' => "high",
                    'row_height' => 5,
                    'max_length' => 0,
                    'question' => "High",
                    'tooltip' => "From work or personal, just something that stands out as good",
                    'placeholder' => "",
                    'position' => 3,
                    'required' => 1
                )
            );
            $wpdb->insert($table_name,
                array(
                    'field_type' => "text",
                    'field_name' => "low",
                    'row_height' => 5,
                    'max_length' => 0,
                    'question' => "Low",
                    'tooltip' => "From work or personal, something you remember (even the lowest high is a low)",
                    'placeholder' => "",
                    'position' => 4,
                    'required' => 1
                )
            );
            $wpdb->insert($table_name,
                array(
                    'field_type' => "text",
                    'field_name' => "gratitude",
                    'row_height' => 5,
                    'max_length' => 0,
                    'question' => "Thankful for",
                    'tooltip' => "Gratitude makes life better, do it frequently, even more than once a week.",
                    'placeholder' => "",
                    'position' => 5,
                    'required' => 1
                )
            );
            $wpdb->insert($table_name,
                array(
                    'field_type' => "text",
                    'field_name' => "goals",
                    'row_height' => 5,
                    'max_length' => 0,
                    'question' => "Goals",
                    'tooltip' => "How is progress going on your education and character goals?",
                    'placeholder' => "",
                    'position' => 7,
                    'required' => 1
                )
            );

        }
        if(!$db_version || $db_version == "1.0") {
            $table_name = $wpdb->prefix . 'rhythmus_goal_topic';

            $wpdb->insert($table_name,
                array(
                    'name' => "Career",
                    'title' => "Career",
                )
            );
            $wpdb->insert($table_name,
                array(
                    'name' => "Financial",
                    'title' => "Financial",
                )
            );
            $wpdb->insert($table_name,
                array(
                    'name' => "Spiritual",
                    'title' => "Spiritual",
                )
            );
            $wpdb->insert($table_name,
                array(
                    'name' => "Physical",
                    'title' => "Physical",
                )
            );
            $wpdb->insert($table_name,
                array(
                    'name' => "Intellectual",
                    'title' => "Intellectual",
                )
            );
            $wpdb->insert($table_name,
                array(
                    'name' => "Family",
                    'title' => "Family",
                )
            );
            $wpdb->insert($table_name,
                array(
                    'name' => "Social",
                    'title' => "Social",
                )
            );

        }
        add_option( "rhythmus_db_version", "1.1" );

    }
}
