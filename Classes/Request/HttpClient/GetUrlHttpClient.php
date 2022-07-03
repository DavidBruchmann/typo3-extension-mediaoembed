<?php

namespace Sto\Mediaoembed\Request\HttpClient;

use GuzzleHttp\Exception\RequestException;
use Sto\Mediaoembed\Exception\HttpClientRequestException;
use TYPO3\CMS\Core\Http\RequestFactory;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Utility\DebuggerUtility;

class GetUrlHttpClient implements HttpClientInterface
{
    /**
     * @param string $requestUrl
     * @return string
     * @throws HttpClientRequestException
     */
    public function executeGetRequest(string $requestUrl): string
    {
        $requestFactory = GeneralUtility::makeInstance(RequestFactory::class);
        try {
            $response = $requestFactory->request($requestUrl);
        } catch (RequestException $exception) {
            return false;
        }

        $content = $response->getBody()->getContents();
        if($content) {
            return $content;
        }

        throw new HttpClientRequestException(
            'fetching of URL '.$requestUrl.' not successful',
            $response->getStatusCode(),
            null,
            $response->getReasonPhrase()
        );
    }

    /**
     * Tries to get the real error code from the $report array of
     * GeneralUtility::getURL()
     *
     * @param array $report report array of GeneralUtility::getURL()
     * @return string the error code
     * @see t3lib_div::getURL()
     */
    private function getErrorCode(array $report): string
    {
        $message = $report['message'];

        if (strstr($message, '404')) {
            return '404';
        }

        if (strstr($message, '501')) {
            return '501';
        }

        if (strstr($message, '401')) {
            return '401';
        }

        return (string)$report['error'];
    }
}
