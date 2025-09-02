<?php

namespace Capybash\MagicBB;

use s9e\TextFormatter\Configurator;

class Configure
{
    public function __invoke(Configurator $config): void
    {
        $this->addAlert($config, 'info');

        $config->BBCodes->addCustom(
            '[spoiler title={TEXT;optional}]{TEXT}[/spoiler]',
            '<details class="bb-spoiler"><xsl:if test="@title"><summary class="bb-spoiler__title"><xsl:value-of select="@title"/></summary></xsl:if><div class="bb-spoiler__body"><xsl:apply-templates/></div></details>'
        );

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
        $config->BBCodes->addCustom('[tr]{TEXT}[/tr]',       '<tr><xsl:apply-templates/></tr>');
        $config->BBCodes->addCustom('[th]{TEXT}[/th]',       '<th><xsl:apply-templates/></th>');
        $config->BBCodes->addCustom('[td]{TEXT}[/td]',       '<td><xsl:apply-templates/></td>');

        $config->BBCodes->addCustom('[justify]{TEXT}[/justify]', '<div class="bb-justify"><xsl:apply-templates/></div>');

        $config->BBCodes->addCustom('[ileft]{URL}[/ileft]',   '<img src="{URL}" class="bb-img--left" />')->contentAttribute = 'url';
        $config->BBCodes->addCustom('[iright]{URL}[/iright]', '<img src="{URL}" class="bb-img--right" />')->contentAttribute = 'url';

        $config->plugins->load('PipeTables');
    }

    protected function addAlert(Configurator $config, string $name): void
    {
        $config->BBCodes->addCustom(
            '['.$name.' title={TEXT;optional} font={COLOR;optional} bg={COLOR;optional} border={COLOR;optional}]{TEXT}[/'.$name.']',
            '<div class="bb-alert bb-alert--'.$name.'">
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
}