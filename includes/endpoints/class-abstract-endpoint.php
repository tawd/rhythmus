<?php

namespace Rhythmus\Endpoints;

use Rhythmus;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;


abstract class Abstract_Endpoint {

	/**
	 * Instance of this class.
	 *
	 * @var      object
	 */
	protected static $instance;
	/**
	 * Handle endpoint authentication
	 *
	 * @var \Rhythmus\Endpoint_Authentication $auth
	 */
	protected $auth;
	/**
	 * The root path of this plugin
	 *
	 * @var string $plugin_slug
	 */
	protected $plugin_slug;
	/**
	 * Current version of the API
	 *
	 * @var string $api_version
	 */
	protected $api_version = 1;

	/**
	 * Initialize the plugin by setting localization and loading public scripts
	 * and styles.
	 *
	 */
	public function __construct() {
		$plugin            = Rhythmus\rhythmus::get_instance();
		$this->plugin_slug = $plugin->get_plugin_slug();
		$this->auth        = new Rhythmus\Endpoint_Authentication();
	}

	/**
	 * Return an instance of this class.
	 *
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null === self::$instance ) {
			self::$instance = new static();
			self::$instance->do_hooks();
		}

		return self::$instance;
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
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {
	}

	/**
	 * @param $route
	 * @param $route_data
	 */
	protected function register_route( $route, $route_data ) {

		$namespace = "$this->plugin_slug/v$this->api_version";

		$route = trailingslashit( $route );

		if ( ! array_key_exists( 'methods', $route_data ) ) {
			$route_data['methods'] = WP_REST_Server::READABLE;
		}

		if ( ! array_key_exists( 'permission_callback', $route_data ) ) {
			$route_data['permission_callback'] = array( $this->auth, 'permissions_check' );
		}

		register_rest_route( $namespace, $route, $route_data );
	}

	/**
	 * Validate any values that ought to be integers.
	 *
	 * @param mixed $value
	 * @param WP_REST_Request $request
	 * @param string $param
	 * @return WP_Error
	 */
	public function validate_int( $value, $request, $param ) {

		if ( ! is_numeric( $value ) ) {
			return new WP_Error( 'rest_invalid_param', 'This value needs to be a number.' );
		}
	}

	/**
	 * Take in some data and format the responses;
	 *
	 * @param $payload
	 *
	 * @return \WP_REST_Response
	 */
	protected function endpoint_response( $payload = array() ) {

		$response      = new WP_REST_Response();
		$response_data = array(
			'app'     => ucfirst( $this->plugin_slug ),
			'version' => $this->api_version,
		);

		if ( is_wp_error( $payload ) ) {

			$response_data['success'] = false;
			$response_data['error']   = $payload->get_error_message();

			$response->set_data( $response_data );
			$response->set_status( 400 );

			return $response;
		}

		if ( ! array( $payload ) ) {
			$payload = array( $payload );
		}

		$response_data['success'] = true;
		$response_data = array_merge( $response_data, $payload );

		$response->set_data( $response_data );
		$response->set_status( 200 );

		return $response;
	}
}
