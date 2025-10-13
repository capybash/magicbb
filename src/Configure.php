<?php

namespace Capybash\MagicBB;

use Flarum\Settings\SettingsRepositoryInterface;
use s9e\TextFormatter\Configurator;

class Configure
{
    protected SettingsRepositoryInterface $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(Configurator $config): void
    {
        $iframeEnabled = (bool) intval($this->settings->get('capybash-magicbb.bb_iframe', '1'));

        if ($iframeEnabled) {
            $this->enableRawIframe($config);
            $this->addIframeBBCode($config);
        }

        $this->addAlert($config, 'info');
        $this->addAlert($config, 'success');
        $this->addAlert($config, 'warning');
        $this->addAlert($config, 'error');

        $this->addSpoiler($config);
        $this->addImageBBCodes($config);

        $config->BBCodes->addCustom('[hr]', '<hr class="bb-hr" />');
        $config->BBCodes->addFromRepository('SUB');
        $config->BBCodes->addFromRepository('SUP');

        $config->BBCodes->addCustom(
            '[abbr={TEXT1}]{TEXT2}[/abbr]',
            '<abbr title="{@abbr}"><xsl:apply-templates/></abbr>'
        );

        $config->BBCodes->addCustom('[table]{TEXT}[/table]', '<table class="bb-table"><xsl:apply-templates/></table>');
        $config->BBCodes->addCustom('[thead]{TEXT}[/thead]', '<thead><xsl:apply-templates/></thead>');
        $config->BBCodes->addCustom('[tbody]{TEXT}[/tbody]', '<tbody><xsl:apply-templates/></tbody>');
        $config->BBCodes->addCustom('[tr]{TEXT}[/tr]', '<tr><xsl:apply-templates/></tr>');
        $config->BBCodes->addCustom('[th]{TEXT}[/th]', '<th><xsl:apply-templates/></th>');
        $config->BBCodes->addCustom('[td]{TEXT}[/td]', '<td><xsl:apply-templates/></td>');

        $config->BBCodes->addCustom('[justify]{TEXT}[/justify]', '<div class="bb-justify"><xsl:apply-templates/></div>');
        $config->BBCodes->addCustom('[left]{TEXT}[/left]', '<div class="bb-left"><xsl:apply-templates/></div>');
        $config->BBCodes->addCustom('[right]{TEXT}[/right]', '<div class="bb-right"><xsl:apply-templates/></div>');

        $config->plugins->load('PipeTables');
    }

    protected function enableRawIframe(Configurator $config): void
    {
        $config->HTMLElements->allowUnsafeElement('iframe');

        foreach ([
            'align', 'allow', 'allowpaymentrequest', 'class', 'credentialless', 'csp',
            'frameborder', 'height', 'id', 'loading', 'longdesc', 'marginheight',
            'marginwidth', 'name', 'referrerpolicy', 'sandbox', 'scrolling',
            'src', 'style', 'title', 'width',
        ] as $attr) {
            $config->HTMLElements->allowUnsafeAttribute('iframe', $attr);
        }
    }

    protected function addSpoiler(Configurator $config): void
    {
        $config->BBCodes->addCustom(
            '[spoiler title={TEXT;optional} img={URL;optional}]{TEXT}[/spoiler]',
            '<details class="bb-spoiler">
                <xsl:if test="@title or @img">
                    <summary>
                        <xsl:attribute name="class">
                            bb-spoiler__title<xsl:if test="@img"> bb-spoiler__title--image</xsl:if>
                        </xsl:attribute>
                        <xsl:if test="@img">
                            <img class="bb-spoiler__titleImg" src="{@img}" alt=""/>
                        </xsl:if>
                        <xsl:if test="@title">
                            <span class="bb-spoiler__titleText"><xsl:value-of select="@title"/></span>
                        </xsl:if>
                    </summary>
                </xsl:if>
                <div class="bb-spoiler__body"><xsl:apply-templates/></div>
            </details>'
        );
    }

    protected function addAlert(Configurator $config, string $name): void
    {
        $config->BBCodes->addCustom(
            '[' . $name . ' title={TEXT;optional} font={COLOR;optional} bg={COLOR;optional} border={COLOR;optional}]{TEXT}[/' . $name . ']',
            '<div class="bb-alert bb-alert--' . $name . '">
                <xsl:attribute name="style">
                    <xsl:if test="@bg">background: <xsl:value-of select="@bg"/>;</xsl:if>
                    <xsl:if test="@border">border-color: <xsl:value-of select="@border"/>;</xsl:if>
                    <xsl:if test="@font">color: <xsl:value-of select="@font"/>;</xsl:if>
                </xsl:attribute>
                <xsl:if test="@title">
                    <div class="bb-alert__head">
                        <span class="bb-alert__icon"></span>
                        <span class="bb-alert__title"><xsl:value-of select="@title"/></span>
                    </div>
                </xsl:if>
                <div class="bb-alert__body"><xsl:apply-templates/></div>
            </div>'
        );
    }

    protected function addImageBBCodes(Configurator $config): void
    {
        $config->BBCodes->addCustom(
            '[ileft]{TEXT}[/ileft]',
            '<div class="bb-media bb-media--left"><xsl:apply-templates/></div>'
        );

        $config->BBCodes->addCustom(
            '[icenter]{TEXT}[/icenter]',
            '<div class="bb-media bb-media--center"><xsl:apply-templates/></div>'
        );

        $config->BBCodes->addCustom(
            '[iright]{TEXT}[/iright]',
            '<div class="bb-media bb-media--right"><xsl:apply-templates/></div>'
        );
    }

    protected function addIframeBBCode(Configurator $config): void
    {
        $bb = $config->BBCodes->addCustom(
            '[iframe src={URL} width={NUMBER?} height={NUMBER?}]{TEXT?}[/iframe]',
            '<iframe frameborder="0" allowfullscreen="" loading="lazy">
                <xsl:attribute name="src"><xsl:value-of select="@src"/></xsl:attribute>
                <xsl:if test="@width"><xsl:attribute name="width"><xsl:value-of select="@width"/></xsl:attribute></xsl:if>
                <xsl:if test="@height"><xsl:attribute name="height"><xsl:value-of select="@height"/></xsl:attribute></xsl:if>
                <xsl:apply-templates/>
            </iframe>'
        );

        $bb->contentAttribute = 'src';
    }
}