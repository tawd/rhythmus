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
class KRA_Topics extends Abstract_Endpoint {

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {

		$kra_topics_route = '/kra-topics';

		$this->register_route( $kra_topics_route, array(
			array(
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_kra_topics' ),
				'args'     => array(),
			),
		) );
	}

	/**
	 * Get KRA topics
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_kra_topics( $request ) {
		global $wpdb;

		$results = $wpdb->get_results( "SELECT id, name, title, description, type, source 
        FROM {$wpdb->prefix}rhythmus_kra_topic" );

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
				'type'        => $type,
				'description' => $row->description
			);
			if ( $row->source === 1 ) {
				$topic['source'] = 'kra-titles';
			}

			$topics[] = $topic;
		}

		return new WP_REST_Response( array( 'topics' => $topics ), 200 );
	}
}
