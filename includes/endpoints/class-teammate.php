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
use WP_Error;
use WP_REST_Request;
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
				'callback' => array( $this, 'get_teammate_list' ),
				'args'     => array(),
			),
		) );
	}

	/**
	 * Get Teammate List
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_Error|WP_REST_Request
	 */
	public function get_teammate_list( $request ) {
		global $wpdb;

		$results = $wpdb->get_results( "SELECT rt.id, fname, lname, year, month, total, submitted, reviewed 
        from {$wpdb->prefix}rhythmus_teammate rt left outer join {$wpdb->prefix}rhythmus_kra_review rkr on rt.id = rkr.teammate_id 
        where rt.is_active = 1 order by fname asc, year desc, month desc", OBJECT );

		$teammates  = array();
		$currUser   = false;
		$currUserID = null;
		$currScores = array();
		foreach ( $results as $row ) {
			if ( $row->id != $currUserID ) {
				if ( $currUser ) {
					$currUser["months"] = $currScores;
					array_push( $teammates, $currUser );
				}
				$currUser   = array(
					"name"   => $row->fname . " " . $row->lname,
					"userid" => $row->id
				);
				$currUserID = $row->id;
				$currScores = array();
			}
			$key                = $row->year . "-" . $row->month;
			$currScores[ $key ] = array(
				"score"     => $row->total,
				"reviewed"  => ( $row->reviewed == 1 ),
				"submitted" => ( $row->submitted == 1 ),
			);
		}
		if ( $currUser ) {
			$currUser["months"] = $currScores;
			array_push( $teammates, $currUser );
		}

		$teamlist = array(
			"app"       => 'Rhythmus',
			"version"   => 1,
			"teammates" => $teammates
		);

		return new \WP_REST_Response( $teamlist, 200 );
	}
}
