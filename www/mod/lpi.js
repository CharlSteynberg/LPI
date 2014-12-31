
   var LPI = function(opt)
   {
      var dfl = {path:'/obj/gearLpi.svg', size:'100%', node:null};
      var obj = document.createElement('div');

      if (!opt)
      { opt = {}; }

      for (var i in dfl)
      {
         if (!opt[i])
         { opt[i] = dfl[i]; }
      }

      obj.path = opt.path;

      if (opt.path !== dfl.path)
      { LPI.markup = null; }

      var bnm = obj.path.split('/').pop();
      var nme = bnm.split('.')[0];

      obj.id           = nme+[].slice.call(document.getElementsByClassName(nme+'Class')).length;
      obj.name         = ''+obj.id;
      obj.baseName     = bnm;
      obj.className    = nme+'Class';

      if (typeof(opt.size) == 'number')
      { opt.size += 'px'; }

      obj.style.height = opt.size;

      if (!LPI.markup)
      {
         var xhr = new XMLHttpRequest();

         xhr.open('GET', obj.path, false);
         xhr.send(null);

         if (xhr.status !== 200)
         { return; }

         var mkp = xhr.responseText;
         var jsc = mkp.indexOf('<script>');

         if (jsc > 0)
         {
            jsc = mkp.split('</script>');

            if (jsc[0].length < jsc[1])
            {
               throw new Error('script expected as last node in root node of markup in '+obj.path);
               return;
            }

            jsc = mkp.split('<script>')[1];
            jsc = jsc.split('</script>')[0];

            if (jsc.indexOf('<![CDATA[') > -1)
            {
               jsc = jsc.split('<![CDATA[')[1];
               jsc = jsc.split(']]>')[0];
            }

            mkp = [mkp.split('<script>')[0], mkp.split('</script>')[1]].join('');
         }
         else
         { jsc = null; }

         LPI.markup = mkp;
         LPI.script = jsc;
      }

      obj.innerHTML = LPI.markup.split(nme).join(obj.name+'obj');
      obj.functions = LPI.script.split(nme).join(obj.name+'obj');
      obj.runScript = function()
      {
         var itv = setInterval(function()
         {
            if (document.getElementById(obj.name+'obj'))
            {
               clearInterval(itv);

               if (obj.functions !== null)
               {
                  try{ eval(obj.functions); }
                  catch(e)
                  {
                     if (e.stack.indexOf('<anonymous>:') > 0)
                     { var errLine = e.stack.split("\n")[1].split('<anonymous>:')[1].split(')')[0].substr(0,1); }
                     else
                     { var errLine = '0'; }

                     console.error('%c '+e.name+"\t"+e.message+"\t\t"+obj.baseName+':'+errLine, 'color: #f00');
                  }
               }

            }
         },10);
      };

      obj.terminate = function()
      {
         Object.defineProperty(obj, 'value', {value:null});

         setTimeout(function()
         {
            obj.innerHTML = '';
            obj.parentNode.removeChild(obj);
            obj = null;
         },100);
      };

      Object.defineProperty(obj, 'value',
      {
         writeable:true,
         enumerable:false,
         configurable:true,
         set:function(prc)
         {
            if (obj)
            {
               var lpiObj = document.getElementById(obj.name+'obj');

               if (lpiObj)
               {
                  lpiObj.value = prc;

                  if (prc > 99)
                  { obj.terminate(); }
               }
            }
         }
      });

      obj.runScript();

      if (opt.node)
      {
         if (typeof opt.node == 'string')
         {
            if (opt.node == 'body')
            { opt.node = document.body; }
            else
            { opt.node = document.getElementById(opt.node); }
         }

         if (opt.node.style)
         { opt.node.appendChild(obj); }
         else
         { console.warn('LPI :: option "node" is not a valid DOM node'); }
      }

      return obj;
   };

   if (typeof module !== 'undefined')
   { module = LPI; }
