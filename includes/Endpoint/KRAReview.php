<?php
/**
 * Rhythmus
 *
 *
 * @package   Rhythmus
 * @author    Todd Watson
 * @license   GPL-3.0
 * @link      https://showit.co
 * @copyright 2019 Showit, Inc
 */

namespace Rhythmus\Endpoint;
use Rhythmus;


/**
 * @subpackage REST_Controller
 */
class KRAReview {
    /**
	 * Instance of this class.
	 *
	 * @since    0.1.1
	 *
	 * @var      object
	 */
	protected static $instance = null;

	/**
	 * Initialize the plugin by setting localization and loading public scripts
	 * and styles.
	 *
	 * @since     0.1.1
	 */
	private function __construct() {
        $plugin = Rhythmus\Rhythmus::get_instance();
		$this->plugin_slug = $plugin->get_plugin_slug();
	}

    /**
     * Set up WordPress hooks and filters
     *
     * @return void
     */
    public function do_hooks() {
        add_action( 'rest_api_init', array( $this, 'register_routes' ) );
    }

	/**
	 * Return an instance of this class.
	 *
	 * @since     0.8.1
	 *
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
			self::$instance->do_hooks();
		}

		return self::$instance;
	}

    /**
     * Register the routes for the objects of the controller.
     */
    public function register_routes() {
        $version = '1';
        $namespace = $this->plugin_slug . '/v' . $version;
        $endpoint = '/kra-review/';

        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::READABLE,
                'callback'              => array( $this, 'get_kra_review' ),
                'permission_callback'   => array( $this, 'kra_permissions_check' ),
                'args'                  => array(),
            ),
        ) );


        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::EDITABLE,
                'callback'              => array( $this, 'update_kra_review' ),
                'permission_callback'   => array( $this, 'kra_permissions_check' ),
                'args'                  => array(),
            ),
        ) );

        $endpoint = '/kra-topics/';
        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::READABLE,
                'callback'              => array( $this, 'get_kra_topics' ),
                'permission_callback'   => array( $this, 'kra_permissions_check' ),
                'args'                  => array(),
            ),
        ) );
    }

    /**
     * Get KRA Review
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function get_kra_review( $request ) {
        global $wpdb;
        $teammate_id = $_GET["teammate_id"];

        $sql = $wpdb->prepare( "SELECT rt.id, fname, lname, year, month, total, submitted, reviewed, topics, 
        review_notes, submit_date, last_update_date 
        from {$wpdb->prefix}rhythmus_teammate rt left outer join {$wpdb->prefix}rhythmus_kra_review rkr on rt.id = rkr.teammate_id 
        where rt.id = %d order by year desc, month desc", $teammate_id );

        $results = $wpdb->get_results($sql, OBJECT);


        $teammate = array(
            "app" => 'Rhythmus',
            "version" => 1
        );
        $months = array();

        foreach ( $results as $row ) 
        {
            if(!$teammate["userid"]) {
                $teammate["userid"] = $row->id;
                $teammate["name"] = $row->fname." ".$row->lname;
            }
            $key = $row->year."-".$row->month;
            $months[$key] = array(
                "score" => $row->total,
                "reviewed" => ($row->reviewed == 1),
                "submitted" => ($row->submitted == 1),
                "review_notes" => $row->review_notes,
                "create-date" => $row->create_date,
                "last-update" => $row->last_update_date,
                "submit-date" => $row->submit_date,
                "topics" => json_decode($row->topics),
            );
        }
        $teammate["months"] = $months;
        
        return new \WP_REST_Response( $teammate, 200 );
    }

    /**
     * Get KRA Topics
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function get_kra_topics( $request ) {
        global $wpdb;

        $results = $wpdb->get_results( "SELECT id, name, title, description, type, source 
        FROM {$wpdb->prefix}rhythmus_kra_topic", OBJECT );
 
        $topics = array();

        foreach ( $results as $row ) 
        {
            $type="";
            if($row->type == 1) {
                $type = "slider";
            }elseif($row->type == 0){
                $type = "outof";
            }
            $topic = array(
                "name" => $row->name,
                "title"=> $row->title,
                "type"=>$type,
                "description"=>$row->description
            );
            if($row->source == 1) {
                $topic["source"] = "kra-titles";
            }
            array_push($topics, $topic);
        }

        return new \WP_REST_Response( array("topics"=>$topics), 200 );
    }

    /**
     * Create OR Update 
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function update_kra_review( $request ) {
        global $wpdb;
        $data = json_decode(file_get_contents('php://input'), true);

        $table_name = $wpdb->prefix . 'rhythmus_kra_review';

        //TODO: Need to check that the teammate_id that is passed in is the current user or supervised or the current user is super admin
        $sql = $wpdb->prepare( "REPLACE INTO $table_name
                (teammate_id, year, month, total, reviewed, review_notes, topics, last_update_date)
                VALUES
                (%d, %d, %d, %d, %d, %s, %s, now())",
                $data['userid'], $data['year'], $data['month'], $data['total'], 
                $data['reviewed'], $data['review_notes'], json_encode($data['topics'])
            );

        $updated = false;
        if( $wpdb->query($sql) ) {
            $updated = true;
        }

        return new \WP_REST_Response( array(
            'success'   => $updated
        ), 200 );
    }

    /**
     * Check if a given request has access
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|bool
     */
    public function kra_permissions_check( $request ) {
        $key = base64_decode($_GET['k']);
        if( $key && strpos($key, ":") > 0 ) {
            $keyParts = explode(":", $key);
            if($params[1] == get_user_meta($params[0], 'rhythmus-key', true)) {
                return true;
            }
        }
        return false;
    }
}
