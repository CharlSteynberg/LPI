
// START
// ========================================================================================================

   // ONLOAD
   // -------------------------------------------------------------------------
      window.addEventListener("load", function load(event)
      {
         window.removeEventListener("load", load, false);

         var LPI = require('lpi');

         var lpi = new LPI({size:'100%', node:'body'});

//         document.body.appendChild(lpi);

         var prc = 0;

         var itv = setInterval(function()
         {
            prc++;
            lpi.value = prc;
         }, 50);

      },false);
   // -------------------------------------------------------------------------

// ========================================================================================================
