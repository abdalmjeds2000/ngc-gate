import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { MdOpenInNew } from 'react-icons/md';
import { AppCtx } from '../../../App';
import './NineBoxs.css';


const icons = {
  AdminServices: <svg xmlns="http://www.w3.org/2000/svg" width="30.574" height="30.574" viewBox="0 0 30.574 30.574"><g id="Group_701" data-name="Group 701"><g id="Group_34" data-name="Group 34"><path id="Path_4752" data-name="Path 4752" d="M22.4,20.446V19.171a5.257,5.257,0,0,0,2.578-4.52V9.96A3.67,3.67,0,0,0,22.193,6.4l.421-.886A.6.6,0,0,0,22.5,4.84L20.133,2.475a.6.6,0,0,0-.679-.117L17.5,3.29a10.413,10.413,0,0,0-2.047-.847L14.721.4a.6.6,0,0,0-.563-.4H10.814a.6.6,0,0,0-.563.4L9.524,2.443a10.408,10.408,0,0,0-2.047.847L5.519,2.358a.6.6,0,0,0-.679.117L2.476,4.84a.6.6,0,0,0-.117.679L3.29,7.478a10.409,10.409,0,0,0-.847,2.047L.4,10.252a.6.6,0,0,0-.4.563v3.344a.6.6,0,0,0,.4.563l2.046.727A10.4,10.4,0,0,0,3.29,17.5l-.931,1.959a.6.6,0,0,0,.117.679L4.84,22.5a.6.6,0,0,0,.679.117l1.959-.931a10.406,10.406,0,0,0,1.858.789,3.916,3.916,0,0,0-.5,1.915v5.589a.6.6,0,0,0,.6.6h7.586a.6.6,0,0,0,0-1.194H10.032V24.387a2.75,2.75,0,0,1,2.747-2.747H16.2v3.305a1.05,1.05,0,0,0,1.683.839l1.389,1.389a.6.6,0,0,0,.844,0l1.4-1.4a1.051,1.051,0,0,0,1.694-.831V21.641h3.423a2.75,2.75,0,0,1,2.747,2.747v4.992H22.4a.6.6,0,0,0,0,1.194h7.581a.6.6,0,0,0,.6-.6V24.387a3.946,3.946,0,0,0-3.941-3.941Zm-.38,4.155-1.464-1.459,1.464-1.464Zm-4.619,0V21.678l1.464,1.464Zm3.8-3.807-1.491,1.48-1.493-1.48V19.686a5.259,5.259,0,0,0,2.985.006Zm-1.483-2.084a4.065,4.065,0,0,1-4.061-4.061v-1.8a3.641,3.641,0,0,0,1.6.369h6.521v1.428a4.065,4.065,0,0,1-4.061,4.061Zm-5.255-6.786v2.726a5.229,5.229,0,0,0,.346,1.874,4.657,4.657,0,1,1-1.215-8.563v1.6a3.647,3.647,0,0,0,.869,2.366ZM23.779,9.96v2.069H17.257a2.472,2.472,0,0,1-2.469-2.469V7.49h6.521A2.472,2.472,0,0,1,23.779,9.96Zm-13.638,11.5-.007,0A9.22,9.22,0,0,1,7.8,20.5a.6.6,0,0,0-.558-.024l-1.858.883L3.618,19.586,4.5,17.728a.6.6,0,0,0-.024-.558,9.214,9.214,0,0,1-.964-2.331.6.6,0,0,0-.378-.412l-1.941-.69v-2.5l1.941-.69a.6.6,0,0,0,.378-.412A9.221,9.221,0,0,1,4.477,7.8.6.6,0,0,0,4.5,7.245L3.618,5.387,5.387,3.618,7.245,4.5A.6.6,0,0,0,7.8,4.477a9.219,9.219,0,0,1,2.331-.964.6.6,0,0,0,.412-.378l.69-1.941h2.5l.69,1.941a.6.6,0,0,0,.412.378,9.218,9.218,0,0,1,2.331.964.6.6,0,0,0,.558.024l1.858-.883,1.769,1.769-.432.909H14.191a.6.6,0,0,0-.578.448,5.852,5.852,0,1,0-1.127,11.594,5.812,5.812,0,0,0,2.874-.754,5.3,5.3,0,0,0,1.662,1.575v1.287H12.779a3.926,3.926,0,0,0-2.638,1.016ZM19.7,25.908l-.958-.958.967-.963.958.954Z" fill="#79d5a7"/><path id="Path_4753" data-name="Path 4753" d="M309.07,265.088a.453.453,0,0,1-.64,0,.6.6,0,1,0-.845.845,1.649,1.649,0,0,0,2.329,0,.6.6,0,0,0-.844-.845Z" transform="translate(-289.053 -249.094)" fill="#79d5a7"/><path id="Path_4754" data-name="Path 4754" d="M320.6,492a.6.6,0,1,0,.422.175A.6.6,0,0,0,320.6,492Z" transform="translate(-300.891 -462.621)" fill="#79d5a7"/></g></g></svg>,
  ITServices: <svg xmlns="http://www.w3.org/2000/svg" width="29.851" height="37.608" viewBox="0 0 29.851 37.608"><g id="Group_42" data-name="Group 42"><g id="Group_41" data-name="Group 41"><path id="Path_4767" data-name="Path 4767" d="M80.7,11.2H77.16c.012-.008.023-.017.036-.024l.951-.549a2.3,2.3,0,0,0,.833-3.108L77.207,4.45A2.278,2.278,0,0,0,74.1,3.617l-.952.549a.941.941,0,0,1-1.374-.793v-1.1A2.278,2.278,0,0,0,69.5,0H65.953a2.278,2.278,0,0,0-2.275,2.275v1.1a.942.942,0,0,1-1.374.793l-.952-.549a2.278,2.278,0,0,0-3.108.833L56.472,7.521a2.278,2.278,0,0,0,.833,3.108l.951.549c.013.007.024.016.036.024H54.749A1.951,1.951,0,0,0,52.8,13.151V30.465a1.952,1.952,0,0,0,1.949,1.949h9.2L63.637,35.1a1.167,1.167,0,0,1-1.161,1.036c-.016,0-.031,0-.047,0h-.738a.735.735,0,0,0,0,1.469H73.76a.735.735,0,0,0,0-1.469h-.738a.4.4,0,0,0-.047,0A1.167,1.167,0,0,1,71.814,35.1L71.5,32.415h9.2a1.952,1.952,0,0,0,1.949-1.949V13.151A1.951,1.951,0,0,0,80.7,11.2ZM64.841,36.139a2.631,2.631,0,0,0,.255-.87l.333-2.854h4.594l.333,2.854a2.635,2.635,0,0,0,.256.87h-5.77Zm1.142-23.583h3.486a.735.735,0,0,0,.735-.735V8.474a4.34,4.34,0,0,1,1.841,3.537,4.322,4.322,0,0,1-2.567,3.948.735.735,0,0,0-.414.85L70.3,21.743a.814.814,0,0,1-.8.73H65.952a.814.814,0,0,1-.8-.73l1.237-4.935a.734.734,0,0,0-.414-.85,4.319,4.319,0,0,1-.725-7.485v3.348a.735.735,0,0,0,.735.735Zm-7.944-3.2a.807.807,0,0,1-.3-1.1l1.773-3.071a.807.807,0,0,1,1.1-.3l.952.549a2.422,2.422,0,0,0,3.577-2.065v-1.1a.807.807,0,0,1,.806-.806H69.5a.807.807,0,0,1,.806.806v1.1a2.422,2.422,0,0,0,3.577,2.065l.952-.549a.807.807,0,0,1,1.1.3l1.773,3.071a.814.814,0,0,1-.295,1.1l-.951.549a2.346,2.346,0,0,0-1.17,1.988,2.37,2.37,0,0,0,1.17,2.144l.951.549a.814.814,0,0,1,.3,1.1l-1.773,3.071a.814.814,0,0,1-1.1.295l-.952-.549a2.408,2.408,0,0,0-2.8.325l-.454-1.811a5.789,5.789,0,0,0-.908-10.44.735.735,0,0,0-.988.689v3.82H66.717V7.267a.735.735,0,0,0-.988-.689,5.79,5.79,0,0,0-.908,10.441l-.454,1.811a2.407,2.407,0,0,0-2.8-.325l-.952.55a.817.817,0,0,1-1.1-.295l-1.773-3.071a.814.814,0,0,1,.295-1.1l.951-.549a2.373,2.373,0,0,0,1.17-2.14A2.347,2.347,0,0,0,58.99,9.906ZM81.182,30.465a.481.481,0,0,1-.48.48H54.749a.481.481,0,0,1-.48-.48V28.559h10.1a.735.735,0,0,0,0-1.469h-10.1V13.151a.481.481,0,0,1,.48-.48h3.635a.69.69,0,0,1-.129.094l-.951.549a2.3,2.3,0,0,0-.833,3.108l1.773,3.071a2.3,2.3,0,0,0,3.108.833l.952-.549a.942.942,0,0,1,1.374.793v1.1a2.3,2.3,0,0,0,2.275,2.275H69.5a2.3,2.3,0,0,0,2.275-2.275v-1.1a.942.942,0,0,1,1.374-.793l.951.549a2.3,2.3,0,0,0,3.108-.832l1.773-3.071a2.3,2.3,0,0,0-.833-3.108l-.951-.549a.709.709,0,0,1-.129-.094H80.7a.481.481,0,0,1,.48.48V27.09H70.854a.735.735,0,1,0,0,1.469H81.182Z" transform="translate(-52.8)" fill="#897ed4"/><path id="Path_4768" data-name="Path 4768" d="M246.434,369.39a.734.734,0,1,0-.3.909A.74.74,0,0,0,246.434,369.39Z" transform="translate(-230.904 -341.847)" fill="#897ed4"/></g></g></svg>,
  EInvoicing: <svg id="e-invoicing" xmlns="http://www.w3.org/2000/svg" width="24.245" height="36.159" viewBox="0 0 24.245 36.159"><g id="Group_763" data-name="Group 763" transform="translate(0)"><path id="Path_5091" data-name="Path 5091" d="M108.595,23.185a12.143,12.143,0,0,0-8.048-11.417,6.591,6.591,0,1,0-8.148,0A12.143,12.143,0,0,0,84.35,23.185a6.6,6.6,0,0,0,4.722,6.321,7.442,7.442,0,0,0,14.8,0A6.6,6.6,0,0,0,108.595,23.185ZM92,6.591a4.472,4.472,0,1,1,4.472,4.472A4.477,4.477,0,0,1,92,6.591ZM96.472,34.04a5.323,5.323,0,1,1,5.323-5.323A5.329,5.329,0,0,1,96.472,34.04Zm7.3-6.75a7.442,7.442,0,0,0-14.608,0,4.478,4.478,0,0,1-2.7-4.1,10,10,0,1,1,20.007,0A4.478,4.478,0,0,1,103.776,27.29Z" transform="translate(-84.35)" fill="#c47dcd"/><path id="Path_5092" data-name="Path 5092" d="M218.772,373.531a1.059,1.059,0,0,0-1.551-1.444l-1.865,2-.568-.568a1.059,1.059,0,0,0-1.5,1.5l1.345,1.345a1.059,1.059,0,0,0,.749.31h.019a1.059,1.059,0,0,0,.756-.337Z" transform="translate(-203.895 -345.496)" fill="#c47dcd"/></g></svg>,
  HRSelfServices: <svg xmlns="http://www.w3.org/2000/svg" width="32.964" height="37.098" viewBox="0 0 32.964 37.098"><g id="Group_703" data-name="Group 703"><g id="Group_32" data-name="Group 32" transform="translate(0 0)"><path id="Path_4750" data-name="Path 4750" d="M12.936,63.941V55.108a3.332,3.332,0,1,0-3.258-5.467L2.214,45.332a3.321,3.321,0,0,0,.153-1A3.337,3.337,0,0,0-.966,41,3.337,3.337,0,0,0-4.3,44.333a3.322,3.322,0,0,0,.153,1l-7.5,4.331a3.325,3.325,0,0,0-2.5-1.128,3.337,3.337,0,0,0-3.333,3.333,3.338,3.338,0,0,0,2.608,3.253v1.113a.725.725,0,0,0,.725.725.725.725,0,0,0,.725-.725V55.121a3.334,3.334,0,0,0,1.735-1.006l3.754,2.2a7.635,7.635,0,0,0-.716,3.237,7.635,7.635,0,0,0,.71,3.223l-3.739,2.171a3.334,3.334,0,0,0-1.743-1.015V62.809a.725.725,0,0,0-.725-.725.725.725,0,0,0-.725.725v1.119a3.338,3.338,0,0,0-2.608,3.253,3.337,3.337,0,0,0,3.333,3.333,3.325,3.325,0,0,0,2.468-1.1l7.529,4.347a3.32,3.32,0,0,0-.153,1A3.337,3.337,0,0,0-.966,78.1a3.337,3.337,0,0,0,3.333-3.333,3.321,3.321,0,0,0-.153-1l7.493-4.326a3.332,3.332,0,1,0,3.229-5.5Zm-3.229.981L6,62.772a7.634,7.634,0,0,0,.71-3.223A7.635,7.635,0,0,0,6,56.312l3.717-2.176a3.332,3.332,0,0,0,1.772,1v8.781A3.333,3.333,0,0,0,9.707,64.922ZM-.966,65.78A6.2,6.2,0,0,1-4.746,64.5,2.267,2.267,0,0,1-2.5,62.52H.57A2.267,2.267,0,0,1,2.815,64.5,6.2,6.2,0,0,1-.966,65.78ZM.572,59.533A1.539,1.539,0,0,1-.966,61.07,1.539,1.539,0,0,1-2.5,59.533v-.39A1.539,1.539,0,0,1-.966,57.606,1.539,1.539,0,0,1,.572,59.143Zm3.413,3.794a3.729,3.729,0,0,0-2.469-2.134,2.969,2.969,0,0,0,.505-1.66v-.39A2.99,2.99,0,0,0-.966,56.157a2.99,2.99,0,0,0-2.987,2.987v.39a2.969,2.969,0,0,0,.505,1.66,3.729,3.729,0,0,0-2.469,2.134A6.2,6.2,0,0,1-7.2,59.549,6.238,6.238,0,0,1-.966,53.318a6.238,6.238,0,0,1,6.231,6.231A6.2,6.2,0,0,1,3.985,63.327Zm8.17-13.342a1.884,1.884,0,1,1-1.884,1.884A1.886,1.886,0,0,1,12.155,49.985Zm-3.19.919a3.327,3.327,0,0,0,.017,1.983L5.264,55.062A7.682,7.682,0,0,0-.241,51.9V47.586a3.334,3.334,0,0,0,1.729-1ZM-.966,42.449A1.886,1.886,0,0,1,.918,44.333,1.886,1.886,0,0,1-.966,46.217,1.886,1.886,0,0,1-2.85,44.333,1.886,1.886,0,0,1-.966,42.449Zm-13.177,11.3a1.886,1.886,0,0,1-1.884-1.884,1.886,1.886,0,0,1,1.884-1.884,1.886,1.886,0,0,1,1.884,1.884A1.886,1.886,0,0,1-14.143,53.752Zm3.183-.893a3.323,3.323,0,0,0,.15-.99,3.323,3.323,0,0,0-.135-.937l7.526-4.345a3.334,3.334,0,0,0,1.729,1V51.9A7.682,7.682,0,0,0-7.2,55.063Zm-3.183,16.206a1.886,1.886,0,0,1-1.884-1.884A1.886,1.886,0,0,1-14.143,65.3a1.886,1.886,0,0,1,1.884,1.884A1.886,1.886,0,0,1-14.143,69.065Zm3.186-.905a3.323,3.323,0,0,0,.147-.979,3.32,3.32,0,0,0-.147-.979L-7.2,64.023A7.683,7.683,0,0,0-1.69,67.195v4.317a3.333,3.333,0,0,0-1.729,1Zm9.991,8.489A1.886,1.886,0,0,1-2.85,74.765,1.886,1.886,0,0,1-.966,72.881,1.886,1.886,0,0,1,.918,74.765,1.886,1.886,0,0,1-.966,76.649Zm2.453-4.137a3.333,3.333,0,0,0-1.729-1V67.195a7.682,7.682,0,0,0,5.514-3.172l3.7,2.151a3.331,3.331,0,0,0,0,2.013Zm10.667-3.447a1.884,1.884,0,1,1,1.884-1.884A1.886,1.886,0,0,1,12.155,69.065Z" transform="translate(17.476 -41)" fill="#4ba8d1"/><path id="Path_4751" data-name="Path 4751" d="M18.914,288.579a.725.725,0,1,0-.512-.212A.73.73,0,0,0,18.914,288.579Z" transform="translate(-15.605 -269.296)" fill="#4ba8d1"/></g></g></svg>,
  IncidentsCenter: <svg xmlns="http://www.w3.org/2000/svg" width="29.899" height="27.067" viewBox="0 0 29.899 27.067"><g id="Iconly_Light_Danger" data-name="Iconly/Light/Danger" transform="translate(1.144 1.01)"><g id="Danger" transform="translate(0)"><path id="Path" d="M0,1.134A1.133,1.133,0,0,1,1.125,0,1.119,1.119,0,0,1,2.25,1.118v.016a1.125,1.125,0,1,1-2.25,0Z" transform="translate(12.75 17.646)" fill="#fff" stroke="#f7bd86" stroke-width="1"/><path id="Stroke_3" data-name="Stroke 3" d="M3.068,25H24.791a3.116,3.116,0,0,0,2.729-4.288L16.6,1.609a3.121,3.121,0,0,0-5.458,0L.23,20.713a3.12,3.12,0,0,0,1.715,4.064A3.188,3.188,0,0,0,2.959,25" transform="translate(0)" fill="none" stroke="#f7bd86" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><path id="Stroke_1" data-name="Stroke 1" d="M.5,4.65V0" transform="translate(13.359 9.819)" fill="none" stroke="#f7bd86" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/></g></g></svg>,
  CorrespondingSystem: <svg xmlns="http://www.w3.org/2000/svg" width="32.943" height="32.5" viewBox="0 0 32.943 32.5"><g id="Group_711" data-name="Group 711" transform="translate(-10.75 -15.972)"><path id="Path_5075" data-name="Path 5075" d="M24.31,36.639H11.5V27.905A6.4,6.4,0,0,1,17.905,21.5h0a6.4,6.4,0,0,1,6.405,6.405Z" transform="translate(0 0.823)" fill="none" stroke="#f57575" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path id="Path_5076" data-name="Path 5076" d="M23.405,36.639H42.038V27.905A6.4,6.4,0,0,0,35.633,21.5H17" transform="translate(0.905 0.823)" fill="none" stroke="#f57575" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path id="Path_5077" data-name="Path 5077" d="M13.5,28.5v4.658h8.152V28.5" transform="translate(0.329 1.975)" fill="none" stroke="#f57575" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><rect id="Rectangle_445" data-name="Rectangle 445" width="3" height="10" transform="translate(26.722 37.722)" fill="none" stroke="#f57575" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><circle id="Ellipse_179" data-name="Ellipse 179" cx="1.5" cy="1.5" r="1.5" transform="translate(28.722 26.722)" fill="none" stroke="#f57575" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><line id="Line_5" data-name="Line 5" y2="10" transform="translate(29.722 16.722)" fill="none" stroke="#f57575" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><rect id="Rectangle_446" data-name="Rectangle 446" width="5" height="3" transform="translate(29.722 16.722)" fill="none" stroke="#f57575" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></g></svg>,
  ResearchCenter: <svg id="Group_703" data-name="Group 703" xmlns="http://www.w3.org/2000/svg" width="32.964" height="37.098" viewBox="0 0 32.964 37.098"><g id="Group_32" data-name="Group 32" transform="translate(0 0)"><path id="Path_4750" data-name="Path 4750" d="M12.936,63.941V55.108a3.332,3.332,0,1,0-3.258-5.467L2.214,45.332a3.321,3.321,0,0,0,.153-1A3.337,3.337,0,0,0-.966,41,3.337,3.337,0,0,0-4.3,44.333a3.322,3.322,0,0,0,.153,1l-7.5,4.331a3.325,3.325,0,0,0-2.5-1.128,3.337,3.337,0,0,0-3.333,3.333,3.338,3.338,0,0,0,2.608,3.253v1.113a.725.725,0,0,0,.725.725.725.725,0,0,0,.725-.725V55.121a3.334,3.334,0,0,0,1.735-1.006l3.754,2.2a7.635,7.635,0,0,0-.716,3.237,7.635,7.635,0,0,0,.71,3.223l-3.739,2.171a3.334,3.334,0,0,0-1.743-1.015V62.809a.725.725,0,0,0-.725-.725.725.725,0,0,0-.725.725v1.119a3.338,3.338,0,0,0-2.608,3.253,3.337,3.337,0,0,0,3.333,3.333,3.325,3.325,0,0,0,2.468-1.1l7.529,4.347a3.32,3.32,0,0,0-.153,1A3.337,3.337,0,0,0-.966,78.1a3.337,3.337,0,0,0,3.333-3.333,3.321,3.321,0,0,0-.153-1l7.493-4.326a3.332,3.332,0,1,0,3.229-5.5Zm-3.229.981L6,62.772a7.634,7.634,0,0,0,.71-3.223A7.635,7.635,0,0,0,6,56.312l3.717-2.176a3.332,3.332,0,0,0,1.772,1v8.781A3.333,3.333,0,0,0,9.707,64.922ZM-.966,65.78A6.2,6.2,0,0,1-4.746,64.5,2.267,2.267,0,0,1-2.5,62.52H.57A2.267,2.267,0,0,1,2.815,64.5,6.2,6.2,0,0,1-.966,65.78ZM.572,59.533A1.539,1.539,0,0,1-.966,61.07,1.539,1.539,0,0,1-2.5,59.533v-.39A1.539,1.539,0,0,1-.966,57.606,1.539,1.539,0,0,1,.572,59.143Zm3.413,3.794a3.729,3.729,0,0,0-2.469-2.134,2.969,2.969,0,0,0,.505-1.66v-.39A2.99,2.99,0,0,0-.966,56.157a2.99,2.99,0,0,0-2.987,2.987v.39a2.969,2.969,0,0,0,.505,1.66,3.729,3.729,0,0,0-2.469,2.134A6.2,6.2,0,0,1-7.2,59.549,6.238,6.238,0,0,1-.966,53.318a6.238,6.238,0,0,1,6.231,6.231A6.2,6.2,0,0,1,3.985,63.327Zm8.17-13.342a1.884,1.884,0,1,1-1.884,1.884A1.886,1.886,0,0,1,12.155,49.985Zm-3.19.919a3.327,3.327,0,0,0,.017,1.983L5.264,55.062A7.682,7.682,0,0,0-.241,51.9V47.586a3.334,3.334,0,0,0,1.729-1ZM-.966,42.449A1.886,1.886,0,0,1,.918,44.333,1.886,1.886,0,0,1-.966,46.217,1.886,1.886,0,0,1-2.85,44.333,1.886,1.886,0,0,1-.966,42.449Zm-13.177,11.3a1.886,1.886,0,0,1-1.884-1.884,1.886,1.886,0,0,1,1.884-1.884,1.886,1.886,0,0,1,1.884,1.884A1.886,1.886,0,0,1-14.143,53.752Zm3.183-.893a3.323,3.323,0,0,0,.15-.99,3.323,3.323,0,0,0-.135-.937l7.526-4.345a3.334,3.334,0,0,0,1.729,1V51.9A7.682,7.682,0,0,0-7.2,55.063Zm-3.183,16.206a1.886,1.886,0,0,1-1.884-1.884A1.886,1.886,0,0,1-14.143,65.3a1.886,1.886,0,0,1,1.884,1.884A1.886,1.886,0,0,1-14.143,69.065Zm3.186-.905a3.323,3.323,0,0,0,.147-.979,3.32,3.32,0,0,0-.147-.979L-7.2,64.023A7.683,7.683,0,0,0-1.69,67.195v4.317a3.333,3.333,0,0,0-1.729,1Zm9.991,8.489A1.886,1.886,0,0,1-2.85,74.765,1.886,1.886,0,0,1-.966,72.881,1.886,1.886,0,0,1,.918,74.765,1.886,1.886,0,0,1-.966,76.649Zm2.453-4.137a3.333,3.333,0,0,0-1.729-1V67.195a7.682,7.682,0,0,0,5.514-3.172l3.7,2.151a3.331,3.331,0,0,0,0,2.013Zm10.667-3.447a1.884,1.884,0,1,1,1.884-1.884A1.886,1.886,0,0,1,12.155,69.065Z" transform="translate(17.476 -41)" fill="#a3a5c0"/><path id="Path_4751" data-name="Path 4751" d="M18.914,288.579a.725.725,0,1,0-.512-.212A.73.73,0,0,0,18.914,288.579Z" transform="translate(-15.605 -269.296)" fill="#a3a5c0"/></g></svg>,
  Performance: <svg xmlns="http://www.w3.org/2000/svg" width="30.601" height="30.6" viewBox="0 0 30.601 30.6"><g id="performance" transform="translate(98 146.703)"><g id="_x3C_Group_x3E_" transform="translate(-98 -146.703)"><path id="_x36_" d="M16.79-.015a15.307,15.307,0,0,1,4.386,1.09l.026.011a15.36,15.36,0,0,1,3.891,2.345.477.477,0,0,1,.064.673.3.3,0,0,1-.031.033L22.645,6.615a.482.482,0,0,1-.665.013,10.888,10.888,0,0,0-2.505-1.452l-.023-.01a10.8,10.8,0,0,0-2.808-.732.479.479,0,0,1-.422-.476h0V.457a.484.484,0,0,1,.569-.472Zm4.019,1.974A14.341,14.341,0,0,0,17.182.99V3.543a11.758,11.758,0,0,1,2.636.741.229.229,0,0,1,.024.01,11.852,11.852,0,0,1,2.417,1.35l1.809-1.805a14.43,14.43,0,0,0-3.235-1.872l-.024-.009ZM13.942,4.437A10.858,10.858,0,0,0,8.589,6.653a.48.48,0,0,1-.633-.039h0L5.473,4.139a.478.478,0,0,1,0-.678.47.47,0,0,1,.052-.045,15.357,15.357,0,0,1,3.9-2.341l.026-.01A15.325,15.325,0,0,1,13.855-.019a.479.479,0,0,1,.52.433c0,.014,0,.029,0,.043h0v3.5a.48.48,0,0,1-.436.477ZM10.76,4.294a11.816,11.816,0,0,1,2.658-.751V.99a14.328,14.328,0,0,0-3.6.958l-.023.01A14.427,14.427,0,0,0,6.531,3.84L8.34,5.645a11.857,11.857,0,0,1,2.42-1.351ZM6.665,8.578a10.819,10.819,0,0,0-2.2,5.326.48.48,0,0,1-.476.421H.48A.478.478,0,0,1,0,13.846a.465.465,0,0,1,.008-.088A15.2,15.2,0,0,1,1.1,9.383v0A15.314,15.314,0,0,1,3.461,5.473a.48.48,0,0,1,.675-.063.373.373,0,0,1,.034.03L6.652,7.916a.478.478,0,0,1,.013.662Zm-2.34,2.135A11.906,11.906,0,0,1,5.678,8.3L3.87,6.495A14.417,14.417,0,0,0,1.985,9.747a14.244,14.244,0,0,0-.97,3.619H3.573A11.786,11.786,0,0,1,4.325,10.713ZM27.155,5.49A15.26,15.26,0,0,1,30.6,13.8a.478.478,0,0,1-.434.518l-.042,0H26.61a.48.48,0,0,1-.478-.435,10.757,10.757,0,0,0-.742-2.811h0A10.876,10.876,0,0,0,23.91,8.548a.477.477,0,0,1,.039-.631h0L26.43,5.438a.481.481,0,0,1,.679,0,.44.44,0,0,1,.046.052Zm1.461,4.255a14.345,14.345,0,0,0-1.886-3.25L24.92,8.3a11.788,11.788,0,0,1,1.354,2.412h0v0a11.741,11.741,0,0,1,.752,2.652h2.559a14.311,14.311,0,0,0-.97-3.622Zm1.977,6.987A15.367,15.367,0,0,1,0,16.686a.477.477,0,0,1,.433-.518l.043,0v0H3.99a.48.48,0,0,1,.477.435,10.919,10.919,0,0,0,21.666-.013.479.479,0,0,1,.476-.421h3.511a.48.48,0,0,1,.48.479.539.539,0,0,1-.008.09Zm-5.6,9.148a14.344,14.344,0,0,0,4.594-8.758H27.027a11.881,11.881,0,0,1-23.454,0H1.015A14.418,14.418,0,0,0,24.991,25.88Z" transform="translate(0 0.023)" fill="#b2d14b"/><path id="_x35_" d="M55.9,51.108a3.588,3.588,0,1,1-1.916-1.968A3.572,3.572,0,0,1,55.9,51.108Zm-.919,2.362a2.61,2.61,0,0,0,.03-2.01h0a2.632,2.632,0,1,0-.03,2.011Z" transform="translate(-37.267 -37.165)" fill="#b2d14b"/><path id="_x34_" d="M70.46,47.64,76.53,46.4a.9.9,0,0,1,.638.107.987.987,0,0,1,.445,1.114.9.9,0,0,1-.39.516l-5.29,3.277a.48.48,0,0,1-.661-.154.471.471,0,0,1-.068-.321,2.611,2.611,0,0,0-.158-1.357,2.6,2.6,0,0,0-.339-.6,2.535,2.535,0,0,0-.479-.492.479.479,0,0,1,.23-.851Zm6.23-.3-5.212,1.066h0a3.635,3.635,0,0,1,.69,1.732Z" transform="translate(-53.301 -35.287)" fill="#b2d14b"/><path id="_x33_" d="M60.313,58.046a1.633,1.633,0,0,1-3.036,1.2l0-.005A1.616,1.616,0,0,1,57.293,58a1.632,1.632,0,0,1,.9-.869l0,0a1.63,1.63,0,0,1,2.117.914Zm-.9.868a.677.677,0,0,0-.839-.906.412.412,0,0,1-.062.025.68.68,0,0,0-.36.832.41.41,0,0,1,.026.064.675.675,0,0,0,1.235-.015Z" transform="translate(-43.495 -43.381)" fill="#b2d14b"/><path id="_x32_" d="M31.663,36.743a.479.479,0,0,1-.941-.183,8.074,8.074,0,0,1,.23-.888,8.187,8.187,0,0,1,.326-.857.479.479,0,0,1,.874.39,7.2,7.2,0,0,0-.29.755A7.289,7.289,0,0,0,31.663,36.743Zm2.28-3.972a.478.478,0,1,1-.635-.714,8.132,8.132,0,0,1,7.13-1.83A8.134,8.134,0,0,1,44.6,32.6a.479.479,0,0,1-.7.651,7.155,7.155,0,0,0-7.865-1.76,7.177,7.177,0,0,0-2.086,1.277Z" transform="translate(-23.371 -22.847)" fill="#b2d14b"/><path id="_x31_" d="M49.726,85.4h4.335a1.629,1.629,0,0,1,1.157,2.783h0a1.634,1.634,0,0,1-1.157.478H49.726a1.63,1.63,0,0,1-1.153-.478l0,0a1.622,1.622,0,0,1,0-2.3.316.316,0,0,1,.031-.028,1.628,1.628,0,0,1,1.125-.451Zm4.335.958H49.726a.678.678,0,0,0-.458.179.146.146,0,0,1-.018.019.673.673,0,0,0,.476,1.15h4.335a.678.678,0,0,0,.477-.2h0a.675.675,0,0,0-.478-1.151Z" transform="translate(-36.594 -64.977)" fill="#b2d14b"/></g></g></svg>,
  Majles: <svg xmlns="http://www.w3.org/2000/svg" width="23.239" height="28.277" viewBox="0 0 23.239 28.277"><g id="Group_764" data-name="Group 764" transform="translate(-40.218 0)"><g id="Group_215" data-name="Group 215" transform="translate(40.218 0)"><g id="Group_214" data-name="Group 214" transform="translate(0 0)"><path id="Path_4910" data-name="Path 4910" d="M122.374,155.969h4.189a.655.655,0,0,0,0-1.309h-4.189a.655.655,0,1,0,0,1.309Z" transform="translate(-116.614 -144.972)" fill="#F7BD86"/><path id="Path_4911" data-name="Path 4911" d="M130.49,222.579h-8.116a.655.655,0,1,0,0,1.309h8.116a.655.655,0,0,0,0-1.309Z" transform="translate(-116.614 -208.636)" fill="#F7BD86"/><path id="Path_4912" data-name="Path 4912" d="M130.49,290.5h-8.116a.655.655,0,0,0,0,1.309h8.116a.655.655,0,0,0,0-1.309Z" transform="translate(-116.614 -272.3)" fill="#F7BD86"/><path id="Path_4913" data-name="Path 4913" d="M63.454,23.106V2.488A2.389,2.389,0,0,0,61.166,0Q61.083,0,61,0H46.927a2.663,2.663,0,0,0-2.782,2.487V3.6H43a2.847,2.847,0,0,0-2.782,2.716V26.968a1.146,1.146,0,0,0,.655.916,1.014,1.014,0,0,0,1.113-.2l2-1.8,2.389,2.127a.982.982,0,0,0,.655.262,1.047,1.047,0,0,0,.655-.262l2.356-2.127,2.356,2.127a.982.982,0,0,0,1.309,0l2.389-2.127,1.964,1.8a.785.785,0,0,0,.982.2.982.982,0,0,0,.491-.916V22.321l.393-.295,2,1.8a.949.949,0,0,0,.687.262.589.589,0,0,0,.327-.065A.949.949,0,0,0,63.454,23.106Zm-5.236,3.142L56.68,24.742A.916.916,0,0,0,55.4,24.71l-2.389,2.127L50.691,24.71a1.047,1.047,0,0,0-1.309,0l-2.356,2.127L44.636,24.71a1.08,1.08,0,0,0-1.407.033l-1.7,1.505V6.317A1.538,1.538,0,0,1,43,4.91H57.072a1.272,1.272,0,0,1,1.145,1.407V26.248Zm3.927-23.76v19.9l-1.636-1.505c-.262-.262-.327-.327-.982-.229V6.317A2.577,2.577,0,0,0,57.072,3.6H45.454V2.488A1.36,1.36,0,0,1,46.927,1.31H61a1.08,1.08,0,0,1,1.145,1.178Z" transform="translate(-40.218 0)" fill="#F7BD86"/></g></g></g></svg>,
  DMS: <svg xmlns="http://www.w3.org/2000/svg" width="32.874" height="36.222" viewBox="0 0 32.874 36.222">
        <g id="Group_712" data-name="Group 712" transform="translate(-807.991 -511)">
          <g id="Group_641" data-name="Group 641" transform="translate(807.991 511)">
            <g id="Group_643" data-name="Group 643" transform="translate(0.415 2.682)">
              <g id="Group_642" data-name="Group 642">
                <g id="Group_641-2" data-name="Group 641">
                  <path id="Path_5061" data-name="Path 5061" d="M452.606,1149.48a4.335,4.335,0,0,1-.221,1.367,14.7,14.7,0,0,1,6,3.474,4.34,4.34,0,0,1,1.078-.88c.044-.025.089-.048.134-.072a16.223,16.223,0,0,0-7-4.051C452.6,1149.372,452.606,1149.425,452.606,1149.48Z" transform="translate(-432.029 -1149.318)" fill="#b2b2b2"/>
                  <path id="Path_5062" data-name="Path 5062" d="M393.351,1153.369c.045.024.09.046.134.071a4.335,4.335,0,0,1,1.078.88,14.7,14.7,0,0,1,6-3.474,4.332,4.332,0,0,1-.221-1.367c0-.054,0-.108,0-.162A16.222,16.222,0,0,0,393.351,1153.369Z" transform="translate(-388.48 -1149.318)" fill="#b2b2b2"/>
                  <path id="Path_5063" data-name="Path 5063" d="M376.723,1200.989a14.72,14.72,0,0,1,0-6.938,4.348,4.348,0,0,1-1.294-.492c-.047-.027-.093-.056-.139-.085a16.279,16.279,0,0,0,0,8.091c.046-.029.092-.057.139-.085A4.354,4.354,0,0,1,376.723,1200.989Z" transform="translate(-374.78 -1181.892)" fill="#b2b2b2"/>
                  <path id="Path_5064" data-name="Path 5064" d="M400.345,1254.248a4.341,4.341,0,0,1,.221-1.367,14.7,14.7,0,0,1-6-3.473,4.356,4.356,0,0,1-1.079.879c-.044.025-.089.048-.134.072a16.224,16.224,0,0,0,7,4.051C400.347,1254.356,400.345,1254.3,400.345,1254.248Z" transform="translate(-388.479 -1223.154)" fill="#b2b2b2"/>
                  <path id="Path_5065" data-name="Path 5065" d="M459.6,1250.359c-.045-.024-.09-.046-.134-.072a4.361,4.361,0,0,1-1.08-.879,14.7,14.7,0,0,1-6,3.473,4.336,4.336,0,0,1,.221,1.367c0,.054,0,.108,0,.162A16.224,16.224,0,0,0,459.6,1250.359Z" transform="translate(-432.029 -1223.154)" fill="#b2b2b2"/>
                  <path id="Path_5066" data-name="Path 5066" d="M492.487,1193.474c-.046.029-.092.057-.139.085a4.365,4.365,0,0,1-1.294.492,14.708,14.708,0,0,1,0,6.938,4.356,4.356,0,0,1,1.294.492c.047.027.093.056.139.085a16.277,16.277,0,0,0,0-8.091Z" transform="translate(-460.555 -1181.892)" fill="#b2b2b2"/>
                </g>
              </g>
            </g>
            <g id="Group_646" data-name="Group 646" transform="translate(6.499 8.173)">
              <g id="Group_645" data-name="Group 645">
                <path id="Path_5068" data-name="Path 5068" d="M415.822,1177.209l-.537-1.3,1.341-1.009a10.177,10.177,0,0,0-3-3.007l-1.014,1.339-1.3-.541-1.3-.541.236-1.666a10.063,10.063,0,0,0-4.246-.008l.231,1.668-1.3.537-1.3.537-1.009-1.341a10.18,10.18,0,0,0-3.007,3l1.339,1.013-.541,1.3-.541,1.3-1.666-.236a10.061,10.061,0,0,0-.008,4.246l1.668-.231.537,1.3.537,1.3-1.341,1.009a10.184,10.184,0,0,0,3,3.007l1.013-1.339,1.3.541,1.3.541-.236,1.666a10.063,10.063,0,0,0,4.246.008l-.231-1.668,1.3-.537,1.3-.537,1.009,1.341a10.18,10.18,0,0,0,3.007-3l-1.339-1.013.541-1.3.541-1.3,1.666.236a10.064,10.064,0,0,0,.008-4.246l-1.668.231Zm-7.709,9.452a6.273,6.273,0,1,1,6.273-6.273A6.273,6.273,0,0,1,408.113,1186.661Z" transform="translate(-397.976 -1170.251)" fill="#b2b2b2"/>
              </g>
            </g>
            <g id="Group_647" data-name="Group 647" transform="translate(27.186 7.733)">
              <path id="Path_5069" data-name="Path 5069" d="M481.437,1170.343l.637-.472a2.832,2.832,0,0,0-.8-.812l-.483.629-.315-.134-.314-.133.117-.784a2.824,2.824,0,0,0-1.137-.01l.1.786-.317.128-.317.128-.472-.637a2.832,2.832,0,0,0-.812.8l.628.484-.133.314-.134.314-.784-.117a2.83,2.83,0,0,0-.01,1.137l.786-.1.128.317.128.317-.637.472a2.83,2.83,0,0,0,.8.812l.483-.629.315.134.315.134-.117.784a2.829,2.829,0,0,0,1.137.01l-.1-.786.317-.128.317-.128.472.637a2.826,2.826,0,0,0,.811-.8l-.628-.483.134-.315.134-.315.784.117a2.83,2.83,0,0,0,.01-1.137l-.786.1-.128-.317Zm-1.2,1.63a.779.779,0,1,1,.008-1.1A.779.779,0,0,1,480.234,1171.973Z" transform="translate(-476.844 -1168.574)" fill="#b2b2b2"/>
            </g>
            <g id="Group_648" data-name="Group 648" transform="translate(13.792)">
              <path id="Path_5070" data-name="Path 5070" d="M430.373,1140.862l.637-.472a2.825,2.825,0,0,0-.8-.811l-.483.629-.314-.134-.315-.134.117-.784a2.829,2.829,0,0,0-1.137-.01l.1.786-.317.128-.317.128-.472-.637a2.823,2.823,0,0,0-.811.8l.628.483-.134.314-.133.315-.784-.117a2.831,2.831,0,0,0-.01,1.137l.786-.1.128.317.128.317-.637.472a2.828,2.828,0,0,0,.8.811l.483-.629.314.134.315.134-.117.784a2.829,2.829,0,0,0,1.137.01l-.1-.786.317-.128.317-.128.472.637a2.828,2.828,0,0,0,.812-.8l-.628-.483.133-.315.134-.315.784.117a2.827,2.827,0,0,0,.01-1.137l-.786.1-.128-.317Zm-1.2,1.629a.779.779,0,1,1,.008-1.1A.778.778,0,0,1,429.171,1142.491Z" transform="translate(-425.781 -1139.093)" fill="#b2b2b2"/>
            </g>
            <g id="Group_649" data-name="Group 649" transform="translate(13.792 30.534)">
              <path id="Path_5071" data-name="Path 5071" d="M430.5,1259.1l.128-.317.786.1a2.825,2.825,0,0,0-.01-1.137l-.784.117-.134-.314-.133-.315.628-.483a2.826,2.826,0,0,0-.812-.8l-.472.637-.317-.128-.317-.128.1-.786a2.826,2.826,0,0,0-1.137.01l.117.784-.315.134-.314.134-.483-.629a2.826,2.826,0,0,0-.8.812l.637.472-.128.317-.128.317-.786-.1a2.831,2.831,0,0,0,.01,1.137l.784-.117.133.315.134.315-.628.483a2.824,2.824,0,0,0,.811.8l.472-.637.317.128.317.128-.1.786a2.826,2.826,0,0,0,1.137-.01l-.117-.784.315-.134.314-.134.483.629a2.828,2.828,0,0,0,.8-.812l-.637-.472Zm-1.322-.211a.779.779,0,1,1-.008-1.1A.779.779,0,0,1,429.179,1258.892Z" transform="translate(-425.781 -1255.501)" fill="#b2b2b2"/>
            </g>
            <g id="Group_650" data-name="Group 650" transform="translate(27.186 23.2)">
              <path id="Path_5072" data-name="Path 5072" d="M481.437,1229.308l.637-.472a2.825,2.825,0,0,0-.8-.811l-.483.628-.315-.134-.314-.134.117-.784a2.829,2.829,0,0,0-1.137-.01l.1.786-.317.128-.317.128-.472-.637a2.826,2.826,0,0,0-.812.8l.629.484-.134.314-.134.314-.784-.117a2.829,2.829,0,0,0-.01,1.137l.786-.1.128.317.128.317-.637.472a2.829,2.829,0,0,0,.8.812l.483-.628.315.134.315.134-.117.784a2.824,2.824,0,0,0,1.137.01l-.1-.786.317-.128.317-.128.472.637a2.825,2.825,0,0,0,.811-.8l-.628-.483.134-.314.134-.315.784.117a2.826,2.826,0,0,0,.01-1.137l-.786.1-.128-.317Zm-1.2,1.629a.779.779,0,1,1,.008-1.1A.779.779,0,0,1,480.234,1230.937Z" transform="translate(-476.844 -1227.539)" fill="#b2b2b2"/>
            </g>
            <g id="Group_651" data-name="Group 651" transform="translate(0 7.733)">
              <path id="Path_5073" data-name="Path 5073" d="M374.167,1170.66l-.128.317-.786-.1a2.825,2.825,0,0,0,.01,1.137l.784-.117.134.315.134.315-.628.483a2.824,2.824,0,0,0,.812.8l.472-.637.317.128.317.128-.1.786a2.83,2.83,0,0,0,1.137-.01l-.117-.784.315-.134.315-.134.483.629a2.829,2.829,0,0,0,.8-.812l-.637-.472.128-.317.128-.317.786.1a2.825,2.825,0,0,0-.01-1.137l-.784.117-.134-.314-.134-.314.628-.484a2.833,2.833,0,0,0-.811-.8l-.472.637-.317-.128-.317-.128.1-.786a2.826,2.826,0,0,0-1.137.01l.117.784-.315.133-.314.134-.483-.629a2.833,2.833,0,0,0-.8.812l.637.472Zm1.322.211a.779.779,0,1,1,.008,1.1A.779.779,0,0,1,375.489,1170.871Z" transform="translate(-373.2 -1168.574)" fill="#b2b2b2"/>
            </g>
            <g id="Group_652" data-name="Group 652" transform="translate(0 23.2)">
              <path id="Path_5074" data-name="Path 5074" d="M374.167,1229.625l-.128.317-.786-.1a2.826,2.826,0,0,0,.01,1.137l.784-.117.134.315.134.314-.628.483a2.828,2.828,0,0,0,.811.8l.472-.637.317.128.317.128-.1.786a2.826,2.826,0,0,0,1.137-.01l-.117-.784.315-.134.315-.134.483.628a2.829,2.829,0,0,0,.8-.812l-.637-.472.128-.317.128-.317.786.1a2.824,2.824,0,0,0-.01-1.137l-.784.117-.134-.314-.134-.314.628-.484a2.827,2.827,0,0,0-.811-.8l-.472.637-.317-.128-.317-.128.1-.786a2.83,2.83,0,0,0-1.137.01l.117.784-.315.134-.314.134-.483-.628a2.825,2.825,0,0,0-.8.811l.637.472Zm1.322.211a.779.779,0,1,1,.008,1.1A.778.778,0,0,1,375.489,1229.836Z" transform="translate(-373.2 -1227.539)" fill="#b2b2b2"/>
            </g>
          </g>
          <g id="Group_653" data-name="Group 653" transform="translate(819.144 523.827)">
            <path id="Path_5067" data-name="Path 5067" d="M425.157,1193.615l1.527-.078a5.455,5.455,0,0,0-.415-2.153l-1.447.495-.363-.55-.363-.55,1.025-1.135a5.457,5.457,0,0,0-1.816-1.229l-.673,1.373-.646-.132-.646-.133-.078-1.527a5.451,5.451,0,0,0-2.153.415l.494,1.447-.55.363-.55.363-1.135-1.024a5.454,5.454,0,0,0-1.229,1.816l1.373.673-.132.646-.132.646-1.527.078a5.451,5.451,0,0,0,.415,2.153l1.447-.494.363.55.363.55-1.024,1.135a5.459,5.459,0,0,0,1.816,1.229l.673-1.373.646.132.646.133.078,1.527a5.449,5.449,0,0,0,2.153-.415l-.494-1.447.55-.363.55-.363,1.135,1.024a5.45,5.45,0,0,0,1.229-1.816l-1.373-.673.133-.645ZM421.692,1196a2.571,2.571,0,1,1,2.034-3.015A2.571,2.571,0,0,1,421.692,1196Z" transform="translate(-415.719 -1187.994)" fill="#b2b2b2"/>
          </g>
          <circle id="Ellipse_164" data-name="Ellipse 164" cx="1.044" cy="1.044" r="1.044" transform="translate(823.178 529.591) rotate(-55.993)" fill="#b2b2b2"/>
        </g>
      </svg>,
  ESignatureTool: <svg id="Iconly_Light_Edit" data-name="Iconly/Light/Edit" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                    <g id="Edit" transform="translate(5.667 5.667)">
                      <path id="Stroke_1" data-name="Stroke 1" d="M0,.5H8.5" transform="translate(12.599 20.364)" fill="none" stroke="#b2d14b" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5"/>
                      <path id="Stroke_3" data-name="Stroke 3" d="M11.473.941A2.6,2.6,0,0,1,15.3.737L17.15,2.19a2.594,2.594,0,0,1,.715,3.761L6.813,20.051a1.974,1.974,0,0,1-1.533.757l-4.263.055L.052,16.71a1.982,1.982,0,0,1,.369-1.669Z" transform="translate(0 0)" fill="none" stroke="#b2d14b" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5"/>
                      <path id="Stroke_5" data-name="Stroke 5" d="M0,0,6.392,5.011" transform="translate(9.403 3.581)" fill="none" stroke="#b2d14b" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5"/>
                    </g>
                  </svg>
}
const services = [
  {header: 'Admin Services', link: false, to: '/admin-services', icon: icons.AdminServices},
  {header: 'IT Services', link: false, to: '/services-requests', /* to: 'https://salic.sharepoint.com/sites/newsalic/SitePages/ITServices.aspx', */ icon: icons.ITServices},
  {header: 'e-Invoicing', link: false, to: '/e-invoicing', icon: icons.EInvoicing},
  {header: 'HC Services', link: false, to: '/hc-services', icon: icons.HRSelfServices},
  // {header: 'Incidents Center', link: true, to: 'https://salic.sharepoint.com/sites/newsalic/SitePages/Risk/Center.aspx', icon: icons.IncidentsCenter},
  {header: 'Majles Tech', link: true, to: 'https://boardroom.salic.com/', icon: icons.Majles},
  {header: 'Corresponding System', link: true, to: 'https://masar.salic.com',  icon: icons.CorrespondingSystem},
  {header: 'Research Library', link: false, to: '/research-library', icon: icons.ResearchCenter},
  // {header: 'Performance Managment', link: false, to: '/performance-managment', icon: icons.Performance},
  {header: 'e-Signature Document', link: false, to: '/eSignature-document', icon: icons.ESignatureTool},
  {header: 'e-Document System', link: false, to: '/dms', icon: icons.DMS},
];


function NineBoxs() {
  const { defualt_route } = useContext(AppCtx);
  let navigate = useNavigate();

  return (
    <div className="services-container">
      {services.map((service, i) => {
        return (

          <a onClick={() => service.link ? window.open(service.to, "_blank") : navigate(defualt_route + service.to)} target='_blank' key={i}>
            <div className="service-box">
              <div>
                {/* <img src= alt='' /> */}
                {service.icon}
              </div>
              <h3>{service.header} {service.link ? <span className='open-in-new'><MdOpenInNew /></span> : ''}</h3>
            </div>
          </a>
        )
      })}
    </div>
  )
}

export default NineBoxs