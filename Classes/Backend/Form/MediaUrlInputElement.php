<?php

declare(strict_types=1);

namespace Sto\Mediaoembed\Backend\Form;

use Sto\Mediaoembed\Service\UtilityService;
use TYPO3\CMS\Backend\Form\Element\InputTextElement;
use TYPO3\CMS\Backend\Form\NodeFactory;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\StringUtility;

final class MediaUrlInputElement extends InputTextElement
{
    public static $testMode = false;

    /**
     * @var UtilityService
     */
    private $utilities;

    public function __construct(NodeFactory $nodeFactory, array $data)
    {
        if (self::$testMode) {
            return;
        }
        parent::__construct($nodeFactory, $data);
    }

    public function injectUtilityService(UtilityService $utilityService)
    {
        $this->utilities = $utilityService;
    }

    public function addUrlParserJsToResult(array $result): array
    {
        $this->injectDependencies();

        $wrapperId = $this->utilities->getUniqueId('tx-mediaoembed-url-input-wrapper-');

        $result['html'] = '<div id="' . $wrapperId . '">' . $result['html'] . '</div>';

        $initJs = 'function(UrlParser) { new UrlParser(' . GeneralUtility::quoteJSvalue($wrapperId) . '); }';

        $result['requireJsModules'][] = ['TYPO3/CMS/Mediaoembed/Backend/UrlParser' => $initJs];

        return $result;
    }

    public function render(): array
    {
        $result = parent::render();
        return $this->addUrlParserJsToResult($result);
    }

    private function injectDependencies()
    {
        if ($this->utilities) {
            return;
        }
        $this->injectUtilityService(GeneralUtility::makeInstance(UtilityService::class));
    }
}
