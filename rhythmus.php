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
 *
 * @wordpress-plugin
 * Plugin Name:       Rhythmus
 * Plugin URI:        https://showit.co
 * Description:       Team rhythm plugin to do KRA Reviews and Weekly Reports.
 * Version:           1.0.0
 * Author:            Showit
 * Author URI:        https://showit.co
 * Text Domain:       rhythmus
 * License:           GPL-3.0
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.txt
 * Domain Path:       /languages
 */


namespace Rhythmus;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'RHYTHMUS_VERSION', '1.0.0' );

if ( ! defined( 'RHYTHMUS_ENV' ) ) {
	define( 'RHYTHMUS_ENV', 'development' );
}

require_once plugin_dir_path( __FILE__ ) . 'autoload.php';

/**
 * Register activation and deactivation hooks
 */
register_activation_hook( __FILE__, array( 'Rhythmus\\Rhythmus', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'Rhythmus\\Rhythmus', 'deactivate' ) );

/**
 * Register activation and deactivation hooks
 */
register_activation_hook( __FILE__, array( 'Rhythmus\\Rhythmus', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'Rhythmus\\Rhythmus', 'deactivate' ) );

/**
 * Initialize Plugin
 *
 * @since 1.0.0
 */
function rhythmus_init() {

	$rhythmus = Rhythmus\Rhythmus::get_instance();
	$rhythmus->initialize();

	$url = explode( '?', $_SERVER['REQUEST_URI'] );
	$current_path = strtolower( trim( $url[0], '/' ) );

	if ( 'app' === $current_path ) {
		status_header( 200 );
		include( __DIR__ . '/AppPageTemplate.php' );
		exit();
	}

}
add_action( 'plugins_loaded', 'rhythmus_init' );


