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
use WP_REST_Server;

/**
 * @subpackage REST_Controller
 */
class Teammate extends Abstract_Endpoint {

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {

		$route = '/teammate-list';

		$this->register_route( $route, array(
			array(
				'methods'  => WP_REST_Server::READABLE,
				'callback' => array( $this, 'browse' ),
				'args'     => array(),
			),
		) );
	}

	/**
	 * Get Teammate List
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function browse( $request ) {
		global $wpdb;

		$results = $wpdb->get_results( "SELECT rt.id, fname, lname, year, month, total, submitted, reviewed 
        FROM {$wpdb->prefix}rhythmus_teammate rt LEFT OUTER JOIN {$wpdb->prefix}rhythmus_kra_review rkr on rt.id = rkr.teammate_id 
        WHERE rt.is_active = 1 ORDER BY fname ASC, year DESC, month DESC", OBJECT );

		$teammates       = array();
		$current_user    = false;
		$current_user_id = null;
		$current_scores  = array();

		foreach ( $results as $row ) {
			if ( $row->id !== $current_user_id ) {

				if ( $current_user ) {
					$current_user['months'] = $current_scores;
					$teammates[]            = $current_user;
				}

				$current_user    = array(
					'name'   => $row->fname . ' ' . $row->lname,
					'userid' => $row->id
				);
				$current_user_id = $row->id;
				$current_scores  = array();
			}
			$key                    = $row->year . '-' . $row->month;
			$current_scores[ $key ] = array(
				'score'     => $row->total,
				'reviewed'  => $row->reviewed == 1,
				'submitted' => $row->submitted == 1,
			);
		}
		if ( $current_user ) {
			$current_user['months'] = $current_scores;
			$teammates[]            = $current_user;
		}

		return $this->endpoint_response( array( 'teammates' => $teammates ) );
	}
}
