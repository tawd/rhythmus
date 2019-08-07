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

namespace Rhythmus;

/**
 * @subpackage Rhythmus
 */
class Rhythmus {

	/**
	 * Instance of this class.
	 *
	 * @since    1.0.0
	 *
	 * @var      object
	 */
	protected static $instance;
	/**
	 * The variable name is used as the text domain when internationalizing strings
	 * of text. Its value should match the Text Domain file header in the main
	 * plugin file.
	 *
	 * @since    1.0.0
	 *
	 * @var      string
	 */
	protected $plugin_slug = 'rhythmus';
	/**
	 * @var string $plugin_version
	 */
	protected $plugin_version = '1.0.0';

	/**
	 * Setup instance attributes
	 *
	 * @since     1.0.0
	 */
	private function __construct() {
	}

	/**
	 * Fired when the plugin is activated.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		include_once __DIR__ . '/class-rhythmus-install.php';
		Rhythmus_Install::rhythmus_install();
	}

	/**
	 * Fired when the plugin is deactivated.
	 *
	 * @since    1.0.0
	 */
	public static function deactivate() {
	}

	/**
	 * Return an instance of this class.
	 *
	 * @return    $this    A single instance of this class.
	 * @since     1.0.0
	 *
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null === self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Return the plugin slug.
	 *
	 * @return    string slug variable.
	 * @since    1.0.0
	 *
	 */
	public function get_plugin_slug() {
		return $this->plugin_slug;
	}

	/**
	 * Return the plugin version.
	 *
	 * @return    string slug variable.
	 * @since    1.0.0
	 *
	 */
	public function get_plugin_version() {
		return $this->plugin_version;
	}

	public function initialize() {

		( new Endpoints\Teammate() )->do_hooks();
		( new Endpoints\Weekly_Report() )->do_hooks();
		( new Endpoints\KRA_Review() )->do_hooks();
		( new Endpoints\KRA_Topics() )->do_hooks();
		( new Endpoints\KRA() )->do_hooks();
	}
}
