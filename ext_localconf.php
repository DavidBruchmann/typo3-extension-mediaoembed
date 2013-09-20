<?php
if (!defined('TYPO3_MODE')) {
	die ('Access denied.');
}

$TYPO3_CONF_VARS['SC_OPTIONS']['tslib/class.tslib_content.php']['getData'][] =
	'Sto\\Mediaoembed\\Hooks\\TslibContentGetDataRegisterArray';

\TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
	'Sto.' . $_EXTKEY,
	'OembedMediaRenderer',
	array('Oembed' => 'renderMedia'),
	array(),
	\TYPO3\CMS\Extbase\Utility\ExtensionUtility::PLUGIN_TYPE_CONTENT_ELEMENT
);

$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['ext/install']['update']['tx_mediaoembed_createrequiredcolumns'] = 'Sto\\Mediaoembed\\Install\\CreateRequiredColumnsUpdate';
$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['ext/install']['update']['tx_mediaoembed_migratecontentelements'] = 'Sto\\Mediaoembed\\Install\\MigrateContentElementsUpdate';

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPageTSConfig('
mod.wizards.newContentElement {
	wizardItems {
		special.elements {
			mediaoembed_oembedmediarenderer {
				icon = gfx/c_wiz/multimedia.gif
				title = LLL:EXT:mediaoembed/Resources/Private/Language/locallang_db.xlf:tt_content.CType.I.tx_mediaoembed
				description = LLL:EXT:mediaoembed/Resources/Private/Language/locallang_db.xlf:new_content_element_wizard_oembedmediarenderer_description
				tt_content_defValues {
					CType = mediaoembed_oembedmediarenderer
				}
			}
		}
		special.show := addToList(mediaoembed_oembedmediarenderer)
	}
}
');

if(TYPO3_MODE == 'BE') {
	$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['extbase']['commandControllers'][] = 'Sto\\Mediaoembed\\Command\\MediaoembedCommandController';
}

?>