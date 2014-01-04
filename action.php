<?php
/**
 * DokuWiki Plugin rdfloki (Action Component)
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 * @author  Krzysztof Mirek <krzysztof.mirek@gmail.com>
 */

// must be run within Dokuwiki
if(!defined('DOKU_INC')) die();

class action_plugin_rdfloki extends DokuWiki_Action_Plugin {

    /**
     * Registers a callback function for a given event
     *
     * @param Doku_Event_Handler $controller DokuWiki's event controller object
     * @return void
     */
    public function register(Doku_Event_Handler &$controller) {

       $controller->register_hook('DOKUWIKI_STARTED', 'BEFORE', $this, 'handle');
   //TPL_METAHEADER_OUTPUT
    }

    /**
     * [Custom event handler which performs action]
     *
     * @param Doku_Event $event  event object by reference
     * @param mixed      $param  [the parameters passed as fifth argument to register_hook() when this
     *                           handler was registered]
     * @return void
     */

    public function handle(Doku_Event &$event, $param) {
      global $JSINFO;
      $JSINFO['rdfXmlConfig'] = $this->readConfig();
      $JSINFO['rdfXml'] = $this->readRdfXml($JSINFO['id']);		      
    }

    private function readConfig() {
	return array( 'defaultShow' => $this->getConf('rdfxml-defaultShow'),
		      'containerSelector' => $this->getConf('rdfxml-containerSelector'),
		      'hideExportButton' => $this->getConf('rdfxml-hideExportButton'),
		      'exportButtonSelector' => $this->getConf('rdfxml-exportButtonSelector')
	);
    }
    
    private function readRdfXml($namespaceId) {
      return file_get_contents('data/media/'. preg_replace('/:/', '/', $namespaceId).'.rdf.xml');
    }
}

// vim:ts=4:sw=4:et:
