<?php
/**
 * Plugin Name: Starcast Fibre API
 * Plugin URI: https://starcast.co.za
 * Description: WordPress plugin to properly register fibre packages custom post type and taxonomy with REST API support
 * Version: 1.0.0
 * Author: Starcast Technologies
 * License: GPL v2 or later
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class StarcastFibreAPI {
    
    public function __construct() {
        add_action('init', array($this, 'register_custom_post_types'));
        add_action('init', array($this, 'register_taxonomies'));
        add_action('rest_api_init', array($this, 'register_rest_fields'));
        add_action('acf/init', array($this, 'register_acf_fields'));
    }
    
    /**
     * Register fibre packages custom post type
     */
    public function register_custom_post_types() {
        
        // Register Fibre Packages Post Type
        $fibre_args = array(
            'label' => 'Fibre Packages',
            'public' => true,
            'publicly_queryable' => true,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => true, // Enable REST API
            'rest_base' => 'fibre_packages',
            'query_var' => true,
            'rewrite' => array('slug' => 'fibre_packages'),
            'capability_type' => 'post',
            'has_archive' => true,
            'hierarchical' => false,
            'menu_position' => 5,
            'menu_icon' => 'dashicons-networking',
            'supports' => array('title', 'editor', 'custom-fields'),
            'labels' => array(
                'name' => 'Fibre Packages',
                'singular_name' => 'Fibre Package',
                'menu_name' => 'Fibre Packages',
                'add_new' => 'Add New Package',
                'add_new_item' => 'Add New Fibre Package',
                'edit_item' => 'Edit Fibre Package',
                'new_item' => 'New Fibre Package',
                'view_item' => 'View Fibre Package',
                'search_items' => 'Search Fibre Packages',
                'not_found' => 'No fibre packages found',
                'not_found_in_trash' => 'No fibre packages found in trash'
            )
        );
        register_post_type('fibre_packages', $fibre_args);
        
        // Register LTE Packages Post Type  
        $lte_args = array(
            'label' => 'LTE Packages',
            'public' => true,
            'publicly_queryable' => true,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => true, // Enable REST API
            'rest_base' => 'lte_packages',
            'query_var' => true,
            'rewrite' => array('slug' => 'lte_packages'),
            'capability_type' => 'post',
            'has_archive' => true,
            'hierarchical' => false,
            'menu_position' => 6,
            'menu_icon' => 'dashicons-smartphone',
            'supports' => array('title', 'editor', 'custom-fields'),
            'labels' => array(
                'name' => 'LTE Packages',
                'singular_name' => 'LTE Package',
                'menu_name' => 'LTE Packages',
                'add_new' => 'Add New Package',
                'add_new_item' => 'Add New LTE Package',
                'edit_item' => 'Edit LTE Package',
                'new_item' => 'New LTE Package',
                'view_item' => 'View LTE Package',
                'search_items' => 'Search LTE Packages',
                'not_found' => 'No LTE packages found',
                'not_found_in_trash' => 'No LTE packages found in trash'
            )
        );
        register_post_type('lte_packages', $lte_args);
    }
    
    /**
     * Register custom taxonomies
     */
    public function register_taxonomies() {
        
        // Register Fibre Provider Taxonomy
        $fibre_provider_args = array(
            'hierarchical' => true,
            'public' => true,
            'show_ui' => true,
            'show_admin_column' => true,
            'show_in_nav_menus' => true,
            'show_in_rest' => true, // Enable REST API
            'rest_base' => 'fibre_provider',
            'query_var' => true,
            'rewrite' => array('slug' => 'fibre_provider'),
            'labels' => array(
                'name' => 'Fibre Providers',
                'singular_name' => 'Fibre Provider',
                'search_items' => 'Search Fibre Providers',
                'all_items' => 'All Fibre Providers',
                'parent_item' => 'Parent Fibre Provider',
                'parent_item_colon' => 'Parent Fibre Provider:',
                'edit_item' => 'Edit Fibre Provider',
                'update_item' => 'Update Fibre Provider',
                'add_new_item' => 'Add New Fibre Provider',
                'new_item_name' => 'New Fibre Provider Name',
                'menu_name' => 'Fibre Providers'
            )
        );
        register_taxonomy('fibre_provider', array('fibre_packages'), $fibre_provider_args);
        
        // Register LTE Provider Taxonomy
        $lte_provider_args = array(
            'hierarchical' => true,
            'public' => true,
            'show_ui' => true,
            'show_admin_column' => true,
            'show_in_nav_menus' => true,
            'show_in_rest' => true, // Enable REST API
            'rest_base' => 'lte_provider',
            'query_var' => true,
            'rewrite' => array('slug' => 'lte_provider'),
            'labels' => array(
                'name' => 'LTE Providers',
                'singular_name' => 'LTE Provider',
                'search_items' => 'Search LTE Providers',
                'all_items' => 'All LTE Providers',
                'parent_item' => 'Parent LTE Provider',
                'parent_item_colon' => 'Parent LTE Provider:',
                'edit_item' => 'Edit LTE Provider',
                'update_item' => 'Update LTE Provider',
                'add_new_item' => 'Add New LTE Provider',
                'new_item_name' => 'New LTE Provider Name',
                'menu_name' => 'LTE Providers'
            )
        );
        register_taxonomy('lte_provider', array('lte_packages'), $lte_provider_args);
    }
    
    /**
     * Register REST API fields for ACF compatibility
     */
    public function register_rest_fields() {
        
        // Register ACF fields for fibre packages
        register_rest_field('fibre_packages', 'acf', array(
            'get_callback' => array($this, 'get_acf_fields'),
            'update_callback' => array($this, 'update_acf_fields'),
            'schema' => array(
                'description' => 'ACF fields for fibre packages',
                'type' => 'object'
            )
        ));
        
        // Register ACF fields for LTE packages
        register_rest_field('lte_packages', 'acf', array(
            'get_callback' => array($this, 'get_acf_fields'),
            'update_callback' => array($this, 'update_acf_fields'),
            'schema' => array(
                'description' => 'ACF fields for LTE packages',
                'type' => 'object'
            )
        ));
        
        // Register ACF fields for provider taxonomies
        register_rest_field('fibre_provider', 'acf', array(
            'get_callback' => array($this, 'get_taxonomy_acf_fields'),
            'update_callback' => array($this, 'update_taxonomy_acf_fields'),
            'schema' => array(
                'description' => 'ACF fields for fibre providers',
                'type' => 'object'
            )
        ));
        
        register_rest_field('lte_provider', 'acf', array(
            'get_callback' => array($this, 'get_taxonomy_acf_fields'),
            'update_callback' => array($this, 'update_taxonomy_acf_fields'),
            'schema' => array(
                'description' => 'ACF fields for LTE providers',
                'type' => 'object'
            )
        ));
    }
    
    /**
     * Get ACF fields for posts
     */
    public function get_acf_fields($object, $field_name, $request) {
        if (function_exists('get_fields')) {
            return get_fields($object['id']);
        }
        return array();
    }
    
    /**
     * Update ACF fields for posts
     */
    public function update_acf_fields($value, $object, $field_name, $request) {
        if (function_exists('update_field')) {
            foreach ($value as $field_key => $field_value) {
                update_field($field_key, $field_value, $object->ID);
            }
        }
        return true;
    }
    
    /**
     * Get ACF fields for taxonomy terms
     */
    public function get_taxonomy_acf_fields($object, $field_name, $request) {
        if (function_exists('get_fields')) {
            return get_fields($object['taxonomy'] . '_' . $object['id']);
        }
        return array();
    }
    
    /**
     * Update ACF fields for taxonomy terms
     */
    public function update_taxonomy_acf_fields($value, $object, $field_name, $request) {
        if (function_exists('update_field')) {
            foreach ($value as $field_key => $field_value) {
                update_field($field_key, $field_value, $object['taxonomy'] . '_' . $object['id']);
            }
        }
        return true;
    }
    
    /**
     * Register ACF field groups if ACF is available
     */
    public function register_acf_fields() {
        if (!function_exists('acf_add_local_field_group')) {
            return;
        }
        
        // Fibre Package Fields
        acf_add_local_field_group(array(
            'key' => 'group_fibre_package_fields',
            'title' => 'Fibre Package Details',
            'fields' => array(
                array(
                    'key' => 'field_fibre_download',
                    'label' => 'Download Speed',
                    'name' => 'download',
                    'type' => 'text',
                    'instructions' => 'e.g. 100Mbps',
                    'required' => 1,
                ),
                array(
                    'key' => 'field_fibre_upload',
                    'label' => 'Upload Speed',
                    'name' => 'upload',
                    'type' => 'text',
                    'instructions' => 'e.g. 100Mbps',
                    'required' => 1,
                ),
                array(
                    'key' => 'field_fibre_price',
                    'label' => 'Price',
                    'name' => 'price',
                    'type' => 'number',
                    'instructions' => 'Monthly price in ZAR',
                    'required' => 1,
                ),
                array(
                    'key' => 'field_fibre_promo_active',
                    'label' => 'Promo Active',
                    'name' => 'promo_active',
                    'type' => 'true_false',
                    'ui' => 1,
                ),
                array(
                    'key' => 'field_fibre_promo_price',
                    'label' => 'Promo Price',
                    'name' => 'promo_price',
                    'type' => 'number',
                    'conditional_logic' => array(
                        array(
                            array(
                                'field' => 'field_fibre_promo_active',
                                'operator' => '==',
                                'value' => '1',
                            ),
                        ),
                    ),
                ),
                array(
                    'key' => 'field_fibre_promo_duration',
                    'label' => 'Promo Duration (months)',
                    'name' => 'promo_duration',
                    'type' => 'number',
                    'default_value' => 1,
                    'conditional_logic' => array(
                        array(
                            array(
                                'field' => 'field_fibre_promo_active',
                                'operator' => '==',
                                'value' => '1',
                            ),
                        ),
                    ),
                ),
                array(
                    'key' => 'field_fibre_promo_type',
                    'label' => 'Promo Type',
                    'name' => 'promo_type',
                    'type' => 'select',
                    'choices' => array(
                        'general' => 'General',
                        'new_customers_only' => 'New Customers Only',
                        'existing_customers' => 'Existing Customers',
                    ),
                    'conditional_logic' => array(
                        array(
                            array(
                                'field' => 'field_fibre_promo_active',
                                'operator' => '==',
                                'value' => '1',
                            ),
                        ),
                    ),
                ),
                array(
                    'key' => 'field_fibre_promo_badge',
                    'label' => 'Promo Badge',
                    'name' => 'promo_badge',
                    'type' => 'select',
                    'choices' => array(
                        'hot-deal' => 'Hot Deal',
                        'limited-time' => 'Limited Time',
                        'best-value' => 'Best Value',
                        'new-customer' => 'New Customer',
                        'special-offer' => 'Special Offer',
                    ),
                    'conditional_logic' => array(
                        array(
                            array(
                                'field' => 'field_fibre_promo_active',
                                'operator' => '==',
                                'value' => '1',
                            ),
                        ),
                    ),
                ),
                array(
                    'key' => 'field_fibre_promo_text',
                    'label' => 'Promo Text',
                    'name' => 'promo_text',
                    'type' => 'text',
                    'instructions' => 'Custom promo text (optional)',
                    'conditional_logic' => array(
                        array(
                            array(
                                'field' => 'field_fibre_promo_active',
                                'operator' => '==',
                                'value' => '1',
                            ),
                        ),
                    ),
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => 'fibre_packages',
                    ),
                ),
            ),
        ));
        
        // Fibre Provider Fields
        acf_add_local_field_group(array(
            'key' => 'group_fibre_provider_fields',
            'title' => 'Fibre Provider Details',
            'fields' => array(
                array(
                    'key' => 'field_provider_logo',
                    'label' => 'Provider Logo',
                    'name' => 'logo',
                    'type' => 'image',
                    'return_format' => 'url',
                ),
                array(
                    'key' => 'field_provider_description',
                    'label' => 'Description',
                    'name' => 'description',
                    'type' => 'textarea',
                ),
                array(
                    'key' => 'field_provider_website',
                    'label' => 'Website',
                    'name' => 'website',
                    'type' => 'url',
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'taxonomy',
                        'operator' => '==',
                        'value' => 'fibre_provider',
                    ),
                ),
            ),
        ));
    }
}

// Initialize the plugin
new StarcastFibreAPI();

/**
 * Activation hook to flush rewrite rules
 */
register_activation_hook(__FILE__, 'starcast_fibre_api_activate');
function starcast_fibre_api_activate() {
    // Register post types and taxonomies
    $plugin = new StarcastFibreAPI();
    $plugin->register_custom_post_types();
    $plugin->register_taxonomies();
    
    // Flush rewrite rules
    flush_rewrite_rules();
}

/**
 * Deactivation hook to flush rewrite rules
 */
register_deactivation_hook(__FILE__, 'starcast_fibre_api_deactivate');
function starcast_fibre_api_deactivate() {
    flush_rewrite_rules();
}