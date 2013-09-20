<?php

$languagePrefix = 'LLL:EXT:mediaoembed/Resources/Private/Language/locallang_db.xlf:';
$languagePrefixColumn = $languagePrefix . 'tx_mediaoembed_provider.';

return array(

	'ctrl' => array(
		'label' => 'name',
		'tstamp' => 'tstamp',
		'crdate' => 'crdate',
		'cruser_id' => 'cruser_id',
		'delete' => 'deleted',
		'sortby' => 'sorting',
		'prependAtCopy' => 'LLL:EXT:lang/locallang_general.php:LGL.prependAtCopy',
		'adminOnly' => 1,
		'rootLevel' => 1,
		'enablecolumns' => array(
			'disabled' => 'hidden'
		),
		'title' => $languagePrefix . 'tx_mediaoembed_provider',
		'iconfile'  => \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::extRelPath('mediaoembed') . 'Resources/Public/Icons/table_provider.png',
	),

	'interface' => array(
		'showRecordFieldList' => 'name,hidden,is_generic,description,url_schemes,endpoint,use_generic_providers,embedly_shortname'
	),

	'columns' => array(

		'name' => array(
			'label' => $languagePrefixColumn . 'name',
			'config' => array(
				'type' => 'input',
				'size' => '30',
				'max' => '50',
			)
		),

		'hidden' => array(
			'label' => 'LLL:EXT:lang/locallang_general.xml:LGL.disable',
			'config' => array(
				'type' => 'check',
				'default' => '0'
			)
		),

		'is_generic' => array(
			'label' => $languagePrefixColumn . 'is_generic',
			'config' => array(
				'type' => 'check',
				'default' => '0'
			)
		),

		'description' => array(
			'label' => 'LLL:EXT:lang/locallang_general.xml:LGL.description',
			'config' => array(
				'type' => 'text',
				'rows' => 5,
				'cols' => 30
			)
		),

		'url_schemes' => array(
			'label' => $languagePrefixColumn . 'url_schemes',
			'config' => array(
				'type' => 'text',
				'rows' => 5,
				'cols' => 30
			)
		),

		'endpoint' => array(
			'label' => $languagePrefixColumn . 'endpoint',
			'config' => array(
				'type' => 'input',
				'size' => '30',
				'max' => '255',
				'eval' => 'trim'
			)
		),

		'use_generic_providers' => array(
			'label' => $languagePrefixColumn . 'use_generic_providers',
			'config' => array(
				'type' => 'select',
				'size' => '5',
				'maxitems' => '100',
				'foreign_table' => 'tx_mediaoembed_provider',
				'foreign_table_where' => 'AND tx_mediaoembed_provider.is_generic=1 AND tx_mediaoembed_provider.uid!=###THIS_UID###',
			)
		),

		'embedly_shortname' => array(
			'label' => $languagePrefixColumn . 'embedly_shortname',
			'config' => array(
				'type' => 'input',
				'size' => '30',
				'max' => '50',
				'eval' => 'unique'
			)
		),

		// this is required so that we can use the value in the domain model
		'sorting' => array(
			'config' => array(
				'type' => 'input'
			),
		),
	),
	'types' => array(
		'0' => array('showitem' => 'hidden;;;;1-1-1, name;;;;2-2-2, is_generic, description, url_schemes, endpoint, use_generic_providers, embedly_shortname'),
	),
);
?>