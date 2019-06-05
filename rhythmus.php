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

/**
 * Autoloader
 *
 * @param string $class The fully-qualified class name.
 * @return void
 *
 *  * @since 1.0.0
 */
spl_autoload_register(function ($class) {

    // project-specific namespace prefix
    $prefix = __NAMESPACE__;

    // base directory for the namespace prefix
    $base_dir = __DIR__ . '/includes/';

    // does the class use the namespace prefix?
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        // no, move to the next registered autoloader
        return;
    }

    // get the relative class name
    $relative_class = substr($class, $len);

    // replace the namespace prefix with the base directory, replace namespace
    // separators with directory separators in the relative class name, append
    // with .php
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    // if the file exists, require it
    if (file_exists($file)) {
        require $file;
    }
});

/**
 * Initialize Plugin
 *
 * @since 1.0.0
 */
function init() {
  $rhythmus = Rhythmus::get_instance();  
  $kra_review_rest = Endpoint\KRAReview::get_instance();
  $teammate_rest = Endpoint\Teammate::get_instance();
  $wr_rest = Endpoint\WeeklyReport::get_instance();
  $kra_versions = Endpoint\KRAVersions::get_instance();

  $url = explode( '?', $_SERVER['REQUEST_URI'] );
  $current_path = strtolower( trim( $url[0], '/' ) );

  if("app" == $current_path) {
    status_header( 200 );
		include(__DIR__ . '/AppPageTemplate.php');
		exit();
  }

}
add_action( 'plugins_loaded', 'Rhythmus\\init' );

//Allow CORS
/*
add_action( 'json_api', function( $controller, $method )
{
    header( "Access-Control-Allow-Origin: *" );
    header ("Access-Control-Allow-Headers: *");
    header ("Access-Control-Expose-Headers: Content-Length, X-JSON");
    header ("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
}, 10, 2 );
*/
/**
 * Register activation and deactivation hooks
 */
register_activation_hook( __FILE__, array( 'Rhythmus\\Rhythmus', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'Rhythmus\\Rhythmus', 'deactivate' ) );

