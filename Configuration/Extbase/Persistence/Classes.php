<?php
return [
    \Sto\Mediaoembed\Domain\Model\Content::class => [
        'tableName' => 'tt_content',
        'properties' => [
            'maxwidth' => ['fieldName' => 'tx_mediaoembed_maxwidth'],
            'maxheight' => ['fieldName' => 'tx_mediaoembed_maxheight'],
            'url' => ['fieldName' => 'tx_mediaoembed_url'],
            'playRelated' => ['fieldName' => 'tx_mediaoembed_play_related']
        ],
    ],
];
