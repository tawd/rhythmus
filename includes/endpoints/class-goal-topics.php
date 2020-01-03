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

namespace Rhythmus\Endpoints;

use Rhythmus;
use WP_REST_Request;
use WP_REST_Response;

/**
 * @subpackage REST_Controller
 */
class Goal_Topics extends Abstract_Endpoint {

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {

		$goal_topics_route = '/goal-topics';

		$this->register_route( $goal_topics_route, array(
			array(
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_goal_topics' ),
				'args'     => array(),
			),
		) );
	}

	/**
	 * Get goal topics
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_goal_topics( $request ) {
		global $wpdb;

		$results = $wpdb->get_results( "SELECT id, name, title, description
        FROM {$wpdb->prefix}rhythmus_goal_topic" );

		$topics = array();

		foreach ( $results as $row ) {
			$type = '';
			if ( $row->type == 1 ) {
				$type = 'slider';
			} elseif ( $row->type == 0 ) {
				$type = 'outof';
			}
			$topic = array(
				'name'        => $row->name,
				'title'       => $row->title,
				'description' => $row->description
			);

			$topics[] = $topic;
        }
        $goal_help = get_option('rhythmus_goal_help');
        if(!$goal_help) {
            $goal_help = "Check out <a href='https://www.youtube.com/watch?v=8BtrZcNjBqk' target='_blank'>this video for setting goals</a>.";
            add_option('rhythmus_goal_help', $goal_help);
        }

		return new WP_REST_Response( array( 'topics' => $topics, 'help' => $goal_help ), 200 );
	}
}
