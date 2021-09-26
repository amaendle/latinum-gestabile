'use strict';
function hideEl(el) {
  el.style.display = 'none';
}

function showEl(el) {
  el.style.display = '';
}

function opMenu(el) { 
  console.log("opMenu");
  el.parentElement.getElementsByTagName("ul")[0].style.visibility='visible';
}


function selModus(el, mod) {
  // hide menu
  if (el== null)  return
  if (mod== null)  return
  el.parentElement.parentElement.style.visibility='hidden';
  var kTab = el.closest("table");
  
  // select coloumns
  if (mod=="Aktiv") {
      kTab.querySelectorAll('td[col="5"], td[col="6"]').forEach(element => hideEl(element));
      kTab.querySelectorAll('td[col="3"], td[col="4"]').forEach(element => showEl(element));
  } else if (mod=="Passiv") {
      kTab.querySelectorAll('td[col="3"], td[col="4"]').forEach(element => hideEl(element));
      kTab.querySelectorAll('td[col="5"], td[col="6"]').forEach(element => showEl(element));

    }
}
function selGenus(el, mod) {
  // hide menu
  if (el== null)  return
  if (mod== null)  return
    
  el.parentElement.parentElement.style.visibility='hidden';
  var kTab = el.closest("table");
  
  // select coloumns
  if (mod=="M") {
      //kTab.querySelectorAll('td[col="4"], td[col="5"]').forEach(element => hideEl(element));
      //kTab.querySelectorAll('td[col="3"]').forEach(element => showEl(element));
      kTab.querySelectorAll('td[genus="F"], td[genus="N"]').forEach(element => hideEl(element));
      kTab.querySelectorAll('td[genus="M"]').forEach(element => showEl(element));
  } else if (mod=="F") {
     // kTab.querySelectorAll('td[col="3"], td[col="5"]').forEach(element => hideEl(element));
     // kTab.querySelectorAll('td[col="4"]').forEach(element => showEl(element));
    
      kTab.querySelectorAll('td[genus="M"], td[genus="N"]').forEach(element => hideEl(element));
      kTab.querySelectorAll('td[genus="F"]').forEach(element => showEl(element));

    } else if (mod=="N") {
     // kTab.querySelectorAll('td[col="3"], td[col="4"]').forEach(element => hideEl(element));
     // kTab.querySelectorAll('td[col="5"]').forEach(element => showEl(element));
      
      kTab.querySelectorAll('td[genus="F"], td[genus="M"]').forEach(element => hideEl(element));
      kTab.querySelectorAll('td[genus="N"]').forEach(element => showEl(element));
    }
}

function selTempus(el, tempus) {
  // hide menu
  el.parentElement.parentElement.style.visibility='hidden';
  
  var kTab = el.closest("table");
  // select rows
      kTab.querySelectorAll('tr[row]:not([row="'+tempus+'"],[row="empty1"],[row="colTempus"])').forEach(element => hideEl(element));
  kTab.querySelectorAll('tr[row="'+tempus+'"]').forEach(element => showEl(element));
 //   var tempus="rowPraesens"; //kTab.querySelectorAll('tr[row="'+tempus+'"]').forEach(element => showEl(element));
}

function selPartizip(el, sel) {
  // hide menu
  el.parentElement.parentElement.style.visibility='hidden';
  
  var kTab = el.closest("table");
  // select rows
      kTab.querySelectorAll('tr[row]:not([row="'+sel+'"],[row="empty1"],[row="empty"],[row="colTempus"])').forEach(element => hideEl(element));
  kTab.querySelectorAll('tr[row="'+sel+'"]').forEach(element => showEl(element));
 //   var sel="rowPraesens"; //kTab.querySelectorAll('tr[row="'+sel+'"]').forEach(element => showEl(element));
}

(function () {
  var wortliste = [];
  
     $("#voc-typ").change(function () {
      if ($(this).val() == 'Sonstige') {
        //document.getElementById("voc-typ2").value="";
        //document.getElementById("voc-typ2").hidden=false;
        $("#voc-typ2").val("");
        $("#voc-typ2").show();
        if ($(this).is(":focus")) $("#voc-typ2").focus()
      } else {
        //document.getElementById("voc-typ2").hidden=true;
        //document.getElementById("voc-typ2").value=$(this).val();
        $("#voc-typ2").hide();
        $("#voc-typ2").val($(this).val());
      }
       if ($(this).val() == 'Substantiv') {
        //document.getElementById("form-genus").hidden=false;
         $("#form-genus").show();
         if ($(this).is(":focus")) $("#voc-ltg").focus();
      } else {
        //document.getElementById("form-genus").hidden=true;
        $("#form-genus").hide();
      }
       
      // Placeholder setzen
       if ($(this).val() == 'Substantiv') {
         $("#voc-lat").attr("placeholder", "Nominativ, -Genitivendung");
       } else if ($(this).val() == 'Verb') {
         $("#voc-lat").attr("placeholder", "Infinitiv, Perfekt, PPP/PFA");
       } else {
         $("#voc-lat").attr("placeholder", "");
       }
      // Verbspezifische Anzeigen
      if ($(this).val() == 'Verb') {
        $("#verb_einstellung").show();
      } else {
        $("#verb_einstellung").hide();
      }       
    })
  
  
     $("#voc-list").change(function () {
      if ($(this).val() == 'neu') {
        //document.getElementById("voc-list2").value="";
        //document.getElementById("voc-list2").hidden=false;
        $("#voc-list2").val("");
        $("#voc-list2").show();
        $("#voc-list2").focus();
      } else {
        //document.getElementById("voc-list2").hidden=true;
        //document.getElementById("voc-list2").value=$(this).val();
        $("#voc-list2").hide();
        $("#voc-list2").val($(this).val());
      }
    })
  
  var mainvoctypes = ["Substantiv", "Adjektiv", "Verb", "Pronomen", "Adverb"];
  
  if (!window.indexedDB) {
      window.alert("Ihr Browser unterstützt keine stabile Version von IndexedDB. Dieses und jenes Feature wird Ihnen nicht zur Verfügung stehen.");
  }
  
  const DB_NAME = 'latinum-gestabile';
  const DB_VERSION = 4; 
  const DB_STORE_NAME = 'vocabulary';
  const DB_STORE_UNITS = 'lektionen';
  var db;
  // Used to keep track of which view is displayed to avoid uselessly reloading it
  var current_view_pub_key;
  
  function exSuffix(s) {
		return "<exception><suffix>"+s+"</suffix></exception>";
	}	
  function tagSuffix(s) {
		return "<suffix>"+s+"</suffix>";
	}		
   var lektion1a = [  // ltMit, deHinweis
	{ltW:"hodiē",	                deW:"heute", typ:"Adverb"},
	{ltW:"et",	                  deW:"und", typ:"Konjunktion"},
	{ltW:"forum, -ī", ltG:"n",	  deW:"der Marktplatz", typ:"Substantiv"}, //, das Forum
	{ltW:"in", ltCom:"mit Akk.", ltPlusKasus:"Akk",deW:"in, nach, gegen, auf, zu", deCom:"auf die Frage „wohin?“", typ:"Präposition"},
	{ltW:"properāre, -ō",			  deW:"eilen, sich beeilen",typ:"Verb"}, //regelmäßig
	{ltW:"ibī",					        deW:"da, dort",typ:"Adverb"}, // ibi,ibī ibī̆
	{ltW:"amīcus, -ī", ltG:"m",	deW:"der Freund",typ:"Substantiv"},
	{ltW:"diū",					        deW:"lange, lange Zeit",typ:"Adverb"},
	{ltW:"expectāre, -ō",			  deW:"warten; erwarten",typ:"Verb"}, //regelmäßig
	{ltW:"subitō",				        deW:"plötzlich",typ:"Adverb"},
	{ltW:"senātor, -ōris", ltG:"m",deW:"der Senator, der Ratsherr",typ:"Substantiv"},
	{ltW:"appropinquāre, -ō",		deW:"sich nähern",typ:"Verb"}, //regelmäßig {w:"sich nähern", reflex:1}
	{ltW:"itaque",				        deW:"daher, deshalb",typ:"Konjunktion"},
	{ltW:"populus, -ī", ltG:"m", deW:"das Volk",typ:"Substantiv"},
	{ltW:"clāmāre, -ō",			    deW:"rufen, schreien",typ:"Verb"}, //regelmäßig
	{ltW:"avē",					        deW:"sei gegrüßt!",typ:"Interjektion"}, //Imperativ I, Singular zu avēre
	{ltW:"sed",					        deW:"aber, sondern",typ:"Konjunktion"},
	{ltW:"interrogāre, -ō",		  deW:"fragen, befragen",typ:"Verb"},  //rogare -fragen ist regelmäßig
	{ltW:"ubī?",					        deW:"wo?",typ:"Interrogativadverb"},
	{ltW:"esse, sum, fuī",		    deW:"sein",typ:"Verb", deCom:"Im Konj. Imp. hat esse Nebenformen von einem Stamm fo-: 1.Sg. fo-rem = es-sem  ich wäre; 2.Sg. fo-rēs = es-sēs  du wärst; 3.Sg. fo-ret = es-set  er/sie/es wäre; 3.Pl. fo-rent = es-sent  sie wären."}, //  Für die 1.Pl. und 2.Pl. gibt es solche Formen nicht. Das Partizip sēns (Gen. sentis) seiend ist von dem einfachen Verb esse ausgestorben
     //esse supin: futu futum 
     ];
  var lektion1b = [
	///Lektion 2,3,4.
	{ltW:"posse, possum, potuī",	  deW:"können",typ:"Verb"},
	{ltW:"regiō, -ōnis", ltG:"f",   deW:"das Gebiet",typ:"Substantiv"},
	{ltW:"tempus, -oris", ltG:"n",  deW:"die Zeit",typ:"Substantiv"},
	{ltW:"vīta, -ae", ltG:"f",      deW:"das Leben",typ:"Substantiv"},
	{ltW:"schola, -ae", ltG:"f",    deW:"die Schule",typ:"Substantiv"},	
	{ltW:"ager, agrī", ltG:"m",     deW:"das Feld, der Acker",typ:"Substantiv"},	
  ];    
  
   var lektion2 = [ //Lektion 5
     {ltW:"oppidum, -ī", ltG:"n",     deW:"die (befestigte) Stadt",typ:"Substantiv"},
     {ltW:"māgnus, -a, -um", ltCom:["komparativ: māior, māius","superlativ: maximus, -a, -um"], komparativ:"māior, māius",superlativ:"maximus, -a, -um", deW:"groß, bedeutend",typ:"Adjektiv"}, //Komp Superl
	{ltW:"vīvere, vīvō, vīxī, vīctūrus", ltCom:"im Passiv nur 3. Person Singular", pass:"3.Sg", deW:"leben",typ:"Verb"}, // kons. Laut wikibooks mit PPP victum, kein:"Passiv"
	{ltW:"habitāre, habitō", deW:"wohnen",typ:"Verb"},
     {ltW:"in", ltCom:"mit Abl.", mit:"Abl", deW:"in, an, auf, bei", deCom:"auf die Frage „wo?“",typ:"Präposition"},	
	{ltW:"imperātor, imperātōris", genus:"m",		deW:"der Kaiser, der Herrscher", typ:"Substantiv"},	
	{ltW:"quoque",		deW:"auch",typ:"Adverb"}, // dem betonten Wort nachgest., nicht klass. auch vorangestellt
	{ltW:"regere, regō, rēxī, rēctum",		deW:"regieren, herrschen, lenken",typ:"Verb"}, // kons.
	{ltW:"venīre, veniō, vēnī, ventum",		deW:"kommen",typ:"Verb"}, //unregelmäßig
	{ltW:"audīre, audiō, audīvī, audītum",		deW:"hören",typ:"Verb"}, //regelmäßig, und  //unregelmäßig: "audīre, audiō, audīvī [o. audiī], audītum"
	{ltW:"agricola, -ae", genus:"m",ltCom:"Genus beachten!",		deW:"der Bauer",typ:"Substantiv"},	
	{ltW:"multus, -a, -um",		deW:"viele",typ:"Adjektiv"}, //Komp plūrēs, Superl plūrimus, Adv multum)
	{ltW:"servus, -ī", genus:"m",		deW:"der Sklave",typ:"Substantiv"},
	{ltW:"habēre, habeō, habuī, habitum",		deW:"haben, halten, besitzen",typ:"Verb"}, //regelmäßig
	{ltW:"dominus, -ī", genus:"m",		deW:"der Herr",typ:"Substantiv"},	
	{ltW:"bonus, -a, -um",		deW:"gut",typ:"Adjektiv"}, //Komp melior, ius; Superl optimus, a, um [altl. optumus ]; Adv bene
	{ltW:"scīre, sciō, scīvī, scītum",		deW:"wissen",typ:"Verb"}, //regelmäßig, und  //unregelmäßig: "scīre, sciō, scīvī [o. sciī], scītum", latinum: nur unpers. passiv 3.Sg.
	{ltW:"beātus, -a, -um",		deW:"glücklich",typ:"Adjektiv"}, 
  ];    //vivere im passiv nur 3. pers. singular, ppp victum
   var lektion3 = [
	{ltW:"cum", ltCom:"mit Abl.", mit:"Abl",		deW:"(zusammen) mit",typ:"Präposition"},
	{ltW:"rūrī",ltCom:"Lokativ zu rūs, rūris",		deW:"auf dem Lande",typ:"Adverb"},
	{ltW:"spectāculum, -ī", genus:"n",		deW:"das Schauspiel",typ:"Substantiv"},
	{ltW:"amāre, -ō",		deW:"lieben",typ:"Verb"},  //regelmäßig
	{ltW:"arēna, -ae", genus:"f",		deW:"die Arena, der Sand",typ:"Substantiv"},
	{ltW:"vādere, vādō",		deW:"gehen",typ:"Verb"},
	{ltW:"gladiātor, -ōris", genus:"m",		deW:"der Gladiator",typ:"Substantiv"},
	{ltW:"gladius, -ī", genus:"m",		deW:"das Schwert",typ:"Substantiv"},
	{ltW:"pūgnāre, -ō",		deW:"kämpfen",typ:"Verb"},
	{ltW:"vidēre, videō, vīdī, vīsum",		deW:"sehen",typ:"Verb"}, //,hint:"unregelmäßig"unregelmäßig
	{ltW:"autem",		deW:"jedoch",typ:"Konjunktion"},
	{ltW:"timor, -ōris", genus:"m",		deW:"die Furcht, die Angst",typ:"Substantiv"},
	{ltW:"ē/ex", ltCom:"mit Abl.", mit:"Abl.",		deW:"aus, aus ... heraus",typ:"Präposition"},	// "ē,ex" mit Komma?
	{ltW:"dolēre, doleō, doluī, dolitūrus",		deW:"Schmerz empfinden, leiden",typ:"Verb"}, //regelmäßig
	{ltW:"crēdere, crēdō, crēdidī, crēditum",		deW:"glauben, meinen, anvertrauen",typ:"Verb"},
	{ltW:"domī ",ltCom:"Lokativ zu domus, -ūs",		deW:"zu Hause, daheim",typ:"Adverb"},
	{ltW:"labōrāre, -ō",		deW:"arbeiten",typ:"Verb"},  //regelmäßig
	{ltW:"labor, -ōris", genus:"m",		deW:"die Arbeit, die Mühe, die Anstrengung",typ:"Substantiv"},
	{ltW:"cōgitāre, -ō",		deW:"denken, überlegen",typ:"Verb"},  //regelmäßig
	{ltW:"līberāre, -ō", ltCom:"mit Abl.", mit:"Abl",		deW:"befreien",typ:"Verb"},  //regelmäßig
	{ltW:"cupere, cupiō, cupīvī, cupītum", ltCom:"kein Passiv", kein:"Passiv",		deW:"wünschen",typ:"Verb"}, // doch passiv?  [o. cupiī] kurzvokalische i
	{ltW:"māne",		deW:"früh am Morgen, morgens",typ:"Adverb"},
	{ltW:"vīlla, -ae", genus:"f",		deW:"das Landhaus",typ:"Substantiv"},
	{ltW:"dīcere, dīcō, dīxī, dictum",		deW:"sagen",typ:"Verb"}, // kons.   // imperativ dic, nicht dice!
	{ltW:"apud", ltCom:"mit Akk.", mit:"Akk",		deW:"bei",typ:"Präposition"},	
	{ltW:"mē",		deW:"mich",typ:"Pronomen"},	
  ];
   var lektion4 = [
	{ltW:"lūdus, -i", genus:"m",		deW:"das Spiel",typ:"Substantiv"},
	{ltW:"lūdere, lūdō, lūsī, lūsum",		deW:"spielen, sich vergnügen",typ:"Verb"},
	{ltW:"amīca, -ae", genus:"f",		deW:"die Freundin",typ:"Substantiv"},
	{ltW:"domina, -ae", genus:"f",		deW:"die Herrin",typ:"Substantiv"},
	{ltW:"vocāre, -ō",		deW:"rufen, nennen",typ:"Verb"},  //regelmäßig
	{ltW:"aedificāre, -ō",		deW:"bauen",typ:"Verb"},  //regelmäßig
	{ltW:"currere, currō, cucurrī, cursum",		deW:"laufen",typ:"Verb"}, // kons.
	{ltW:"circā", ltCom:"mit Akk.", mit:"Akk",		deW:"um...herum",typ:"Präposition"},
	{ltW:"equitāre, -ō",		deW:"reiten",typ:"Verb"},  //regelmäßig
	{ltW:"equus, -i", genus:"m",		deW:"das Pferd",typ:"Substantiv"},
	{ltW:"eques, equitis", genus:"m",		deW:"der Reiter",typ:"Substantiv"},
	{ltW:"quaerere, quaerō, quaesīvī, quaesītum",		deW:"suchen, fragen (nach)",typ:"Verb"}, // kons. [o. quaesiī]: , hint:"[o. quaesiī]"
	{ltW:"parvus, -a, -um",		deW:"klein",typ:"Adjektiv"},
	{ltW:"ōrātor, -ōris", genus:"m",		deW:"der Redner",typ:"Substantiv"},
	{ltW:"etiam",		deW:"auch, sogar, noch",typ:"Konjunktion"},
	{ltW:"vīsitāre, -ō",		deW:"besuchen",typ:"Verb"},  //regelmäßig
	{ltW:"tum",		deW:"dann, da, darauf, damals",typ:"Adverb"},
	{ltW:"saepe",		deW:"oft",typ:"Adverb"},
	{ltW:"portāre, -ō",		deW:"tragen",typ:"Verb"},  //regelmäßig
	{ltW:"via, -ae", genus:"f",		deW:"der Weg, die Straße",typ:"Substantiv"},
	{ltW:"laetus, -a, -um",		deW:"froh, fröhlich",typ:"Adjektiv"},
	{ltW:"laetitia, -ae", genus:"f",		deW:"die Freude",typ:"Substantiv"},
	{ltW:"novus, -a, -um",		deW:"neu",typ:"Adjektiv"},
	{ltW:"manēre, maneō, mānsī, mānsum",		deW:"bleiben",typ:"Verb"},
  ];
   var wortliste5 = [
	{ltW:"urbs, urbis", genus:"f",		deW:"die Stadt",typ:"Substantiv", ltCom: "Gen. Pl. -ium"}, // mischdeklination erkennen Sie daran, dass im Vokabelverzeichnis mit angegeben ist, dass die Endung im Genetiv Plural "-ium" ist
	{ltW:"Rōma, -ae", genus:"f",		deW:"Rom",typ:"Substantiv"}, //nomen?
	{ltW:"apud", ltCom:"mit Akk.", mit:"Akk",		deW:"bei, in der Nähe von",typ:"Präposition"},
	{ltW:"flūmen, -minis", genus:"n",		deW:"der Fluss",typ:"Substantiv"},
	{ltW:"situs, -a, -um",		deW:"gelegen",typ:"Adjektiv"},
	{ltW:"bellum, -ī", genus:"n",		deW:"der Krieg",typ:"Substantiv"},
	{ltW:"gerere, gerō, gessī, gestum",		deW:"tragen, führen, ausführen",typ:"Verb"}, // kons.
	{ltW:"bellum gerere",		deW:"einen Krieg führen",typ:"Verbalphrase"}, //idiomatische Wendung
	{ltW:"adversus", ltCom:"mit Akk.",mit:"Akk",		deW:"gegen, gegenüber",typ:"Präposition"},
	{ltW:"Rōmānus, -a, -um",		deW:"römisch",typ:"Adjektiv"},
	{ltW:"cōpia, -ae", genus:"f", ltCom:"im Singular",nursingular:"1",		deW:"die Menge, der Vorrat", deCom:"im Plural: Vorräte, Truppen, Streitkräfte",typ:"Substantiv"},
	{ltW:"cōpiae, -arum", genus:"f", ltCom:"im Plural",nurplural:"1",deCom:"Plural zu copia, -ae",		deW:"Vorräte, Truppen, Streitkräfte",typ:"Substantiv"},
	{ltW:"pūgnāre, -ō",		deW:"kämpfen",typ:"Verb"}, //regelmäßig
	{ltW:"calamitās, -ātis", genus:"f",		deW:"die Niederlage, das Unglück, das Unheil",typ:"Substantiv"},
	{ltW:"ā/ab", ltCom:"mit Abl.",mit:"Abl",		deW:"von, von ... weg, seit",typ:"Präposition"}, //besser:? von...her
	{ltW:"tolerāre, -ō",		deW:"ertragen, erdulden",typ:"Verb"}, //regelmäßig
	{ltW:"dēbēre, dēbeō, dēbuī, dēbitum",		deW:"müssen, schulden, verdanken",typ:"Verb"}, //regelmäßig
	{ltW:"animal, -ālis", genus:"n",		deW:"das Tier, das Lebewesen",typ:"Substantiv"},
	{ltW:"captāre, -ō",		deW:"fangen",typ:"Verb"}, //regelmäßig
	{ltW:"sinere, sinō, sīvī, situm",		deW:"lassen, zulassen",typ:"Verb"}, // kons. sinere, sīvī [o. (altl.) siī], situm> (Perf.-Formen oft synk.: sīstī, sīris, sīrit, sīritis, sīsse(m) u. a.)
	{ltW:"expūgnāre, -ō",		deW:"erobern, einnehmen",typ:"Verb"}, //regelmäßig
	{ltW:"studēre, studeō, studuī, -", ltCom:["mit Dat.","im Passiv nur 3. Person Singular"], mit:"Dativ", pass:"3.Sg",		deW:"sich bemühen (um), sich widmen", typ:"Verb"},  //regelmäßig//Ist ein Verb intransitiv, so wird im Vokabelverzeichnis in Klammern der Kasus angegeben (z.B. studere, studeo (mit Dativ)
	{ltW:"autem",		deW:"jedoch, aber", typ:"Konjunktion"},
	{ltW:"mīles, -litis", genus:"m",		deW:"der Soldat", typ:"Substantiv"},
	{ltW:"nūllus, -a, -um", ltCom:"Sg. Gen.: nūllīus, Sg. Dat.: nūllī",
			flektion:{
				M:{
					Singular:{
						Genitiv:"-"+exSuffix("īus"),
						Dativ:"-"+exSuffix("ī")
					}
				},
				F:{
					Singular:{
						Genitiv:"-"+exSuffix("īus"),
						Dativ:"-"+exSuffix("ī")
					}
				},
				N:{
					Singular:{
						Genitiv:"-"+exSuffix("īus"),
						Dativ:"-"+exSuffix("ī")
					}
				}
			},		deW:"kein",typ:"Adjektiv"}, //Pronominaladjektiv //(Gen Sg nūllīus u. nūllī, Dat nūllī u. nūllō, nūllae)
	{ltW:"mittere, mittō, mīsī, missum",		deW:"schicken, senden",typ:"Verb"}, // kons.
	{ltW:"interim",		deW:"inzwischen, mittlerweile",typ:"Adverb"},
	{ltW:"ōrātiō, -ōnis", genus:"f",		deW:"die Rede",typ:"Substantiv"},
	{ltW:"ōrātiōnem habēre",		deW:"eine Rede halten",typ:"Verbalphrase"}, // idiomatische Wendung orationem habēre
	{ltW:"prohibēre, prohibeō, prohibuī, prohibitum",		deW:"fernhalten, abhalten, hindern",typ:"Verb"}, //regelmäßig
	{ltW:"vir, virī", genus:"m",		deW:"der Mann",typ:"Substantiv"},
	{ltW:"prōspicere, prōspiciō, prōspexī, prōspectum", ltCom:"im Passiv nur 3. Person Singular", pass:"3.Sg",		deW:"sorgen für",typ:"Verb"}, //kurzvokalische i (hin)ausschauen Vorsicht anwenden, Vorsorge treffen, (vor)sorgen (abs.; m. Dat; m. ut, ne) 
	{ltW:"iubēre, iubeō, iussī, iussum", ltCom:"im Passiv nur 3. Person Singular", pass:"3.Sg",		deW:"befehlen, beauftragen",typ:"Verb"}, //unregelmäßig, hint:"unregelmäßig"
	{ltW:"auxilium, -ī", genus:"n", ltCom:"im Singular", nursingular:"1",		deW:"die Hilfe", deCom:"im Plural: Hilfstruppen",typ:"Substantiv"},
	{ltW:"auxila, -ōrum", genus:"n", nurplural:"1",ltCom:"Plural zu auxilium, -ī",		deW:"Hilfstruppen",typ:"Substantiv"},
	{ltW:"Rōmānus, -ī", genus:"m",		deW:"der Römer",typ:"Substantiv"},
	//[{lt:[{w:"saepe"}],de:[{w:"oft"}],typ:"Adverb"}],
	{ltW:"conciliāre, -ō",		deW:"gewinnen",typ:"Verb"}, //regelmäßig
	{ltW:"quī, quae, quod",		deW:"der, die, das; welcher, welche, welches",typ:"Relativpronomen, Interrogativpronomen"},
	
	{ltW:"egō",ltCom:"meī, mihi, mē, mecum",		deW:"ich",deCom:"meiner, mir, mich, mit mir",typ:"Personalpronomen (reflexiv)"}, //lektion 13, mē in lektion 11 
	{ltW:"tū",ltCom:"tuī, tibi, tē, tecum",		deW:"du",deCom:"deiner, dir, dich, mit dir",typ:"Personalpronomen"},	
  ];
    var wortliste6 = [
	{ltW:"semper",deW:"immer",typ:"Adverb"},
	{ltW:"nunc", deW:"jetzt, nun",typ:"Adverb"},
	{ltW:"causa, -ae", genus:"f",deW:"der Grund, die Ursache, das Gerichtsverfahren",typ:"Substantiv"},
	{ltW:"pecūnia, -ae", genus:"f",deW:"das Geld",typ:"Substantiv"},
	{ltW:"accipere, accipiō, accēpī, acceptum",deW:"annehmen, empfangen",typ:"Verb"}, // kurzvokalische i
	{ltW:"īgnōtus, -a, -um",deW:"unbekannt",typ:"Adjektiv"},
	{ltW:"aedificium, -ī", genus:"n",deW:"das Gebäude",typ:"Substantiv"},
	{ltW:"clārus, -a, -um",deW:"hell, berühmt",typ:"Adjektiv"},
	{ltW:"mōnstrāre, -ō",deW:"zeigen",typ:"Verb"}, //regelmäßig
	{ltW:"gaudium, -ī", genus:"n",deW:"die Freude",typ:"Substantiv"},
	{ltW:"spectāre, -ō",deW:"betrachten",typ:"Verb"}, //regelmäßig
	{ltW:"nōmen, -minis", genus:"n",deW:"der Name",typ:"Substantiv"},
	{ltW:"opus, operis", genus:"n",deW:"das Werk, die Arbeit, die Mühe",typ:"Substantiv"},
	{ltW:"tabula, -ae", genus:"f",deW:"die Tafel",typ:"Substantiv"},
   
	{ltW:"memoria, -ae", genus:"f",deW:"Gedächtnis, Andenken",typ:"Substantiv"},
	{ltW:"servāre, -ō",deW:"retten, bewahren",typ:"Verb"}, //regelmäßig
	{ltW:"fābula, -ae", genus:"f",deW:"die Geschichte, die Erzählung",typ:"Substantiv"},
	{ltW:"antīquus, -a, -um",deW:"alt, antik",typ:"Adjektiv"},
	{ltW:"solum",deW:"allein, nur",typ:"Adverb"},
	{ltW:"dēlectāre, -ō",deW:"erfreuen, Freude machen",typ:"Verb"}, //regelmäßig
	{ltW:"īgnōrāre, -ō", ltCom:"mit Dat.", mit:"Dativ",deW:"nicht kennen, nicht wissen",typ:"Verb"}, //regelmäßig//Ist ein Verb intransitiv, so wird im Vokabelverzeichnis in Klammern der Kasus angegeben (z.B. studere, studeo (mit Dativ)
	{ltW:"nōn īgnōrāre",deW:"gut kennen, genau wissen",typ:"Verbalphrase"}, //idiomatische Wendung
	{ltW:"nārrāre, -ō",deW:"erzählen",typ:"Verb"}, //regelmäßig
	{ltW:"errāre, -ō",deW:"irren",typ:"Verb"},
	{ltW:"hūmānus, -a, -um",deW:"menschlich",typ:"Adjektiv"}	
  ];  
   var wortliste7 = [
	{ltW:"turris, turris", genus:"f", ltCom:"Akk. Sg. -im, Abl. Sg. -ī, Gen. Pl. -ium",
		flektion:{ name:"i-Deklination",
				Singular:{
					Akkusativ:"-"+tagSuffix("im"),
					Ablativ:"-"+tagSuffix("ī")
				}
			},deW:"der Turm",typ:"Substantiv"}, //lektion 16
	{ltW:"sitis, sitis", genus:"f", ltCom:"Akk. -im, Abl. -ī",deW:"der Durst",typ:"Substantiv"},
	{ltW:"vīs", genus:"f", ltCom:"kein Gen. Sg. u. Dat. Sg.; Plural: vires, -ium", //Sg Akk vim, Abl vī; Pl Nom u. Akk vīrēs, Gen vīrium, Dat u. Abl vīribus
			flektion:{
				Singular:{
					Genitiv:"",
					Dativ:""
				},
				Plural:{
					Nominativ:"vīr"+tagSuffix("ēs"),
					Genitiv:"vīr"+tagSuffix("ium"),
					Dativ:"vīr"+tagSuffix("ibus"),
					Akkusativ:"vīr"+tagSuffix("ēs"),
					Ablativ:"vīr"+tagSuffix("ibus")
				}
			},deW:"die Kraft, die Gewalt", deCom:"im Plural auch: Streitkräfte",typ:"Substantiv"},
	{ltW:"pār, paris", genus:"n",deW:"das Gleiche",typ:"Substantiv"},
	{ltW:"mare, maris", genus:"n",deW:"das Meer",typ:"Substantiv"},
	{ltW:"esse", ltCom:"mit Dat. der Person", mit:"Dat. der Person",deW:"jmdm. gehören, haben, besitzen",typ:"Verb"}, // dativus possessivus , lektion 17
	{ltW:"ante", ltCom:"mit Akk.", mit:"Akk",deW:"vor",typ:"Präposition"}, //lektion 19
	{ltW:"porta, -ae", genus:"f",deW:"das Tor",typ:"Substantiv"},
	{ltW:"patria, -ae", genus:"f",deW:"die Heimat, das Vaterland",typ:"Substantiv"},
	{ltW:"metuere, metuō, metuī, -", ltCom:"mit Dat.", mit:"Dat",deW:"fürchten, befürchten",typ:"Verb"}, // kons. intransitiv
	{ltW:"invādere, invādō, invāsī, invāsum",deW:"eindringen, einfallen, erobern",typ:"Verb"}, // kons.
	{ltW:"mūrus, -ī", genus:"m",deW:"die Mauer, die Stadtmauer",typ:"Substantiv"},
	{ltW:"circā", ltCom:"mit Akk.", mit:"Akk",deW:"um, um ... herum",typ:"Präposition"}
  ];  
   var wortliste8 = [
	{ltW:"īnsula, -ae", genus:"f",deW:"die Insel",typ:"Substantiv"},
	{ltW:"habitāre, -ō",deW:"wohnen",typ:"Verb"},
	{ltW:"frāter, -tris", genus:"m",deW:"der Bruder	",typ:"Substantiv"},
	{ltW:"pūgna, -ae", genus:"f",deW:"der Kampf, die Schlacht",typ:"Substantiv"},
	{ltW:"laedere, laedō, laesī, laesum",deW:"verletzen, beleidigen",typ:"Verb"}, // kons.
	{ltW:"laetus, -a, -um",deW:"fröhlich",typ:"Adjektiv"},
	{ltW:"invītus, -a, -um",deW:"widerwillig",typ:"Adjektiv"},
	{ltW:"cadere, cadō, cecidī, cāsūrus", ltCom:"im Passiv nur 3. Person Singular", pass:"3.Sg",deW:"fallen, sterben",typ:"Verb"}, // kons.
	{ltW:"uxor, -ōris", genus:"f",deW:"die Gattin, die Ehefrau",typ:"Substantiv"},
	{ltW:"cēna, -ae", genus:"f",deW:"das Essen, die Mahlzeit",typ:"Substantiv"},
	{ltW:"parāre, -ō",deW:"bereiten, vorbereiten",typ:"Verb"},
	{ltW:"solēre, soleō, -, solitus",deW:"pflegen, gewohnt sein",typ:"Verb"},
	{ltW:"merx, mercis", genus:"f",deW:"die Ware",typ:"Substantiv"},
	{ltW:"vendere, vendō, vendidī, venditum",deW:"verkaufen",typ:"Verb"}, // kons. Pass. (klass.) nur venditus u. vendendus; sonst Ersatz durch veneo (venus¹; < venum do, eigtl. „zum Verkauf geben“)
	{ltW:"līberī, -ōrum", genus:"m",deW:"die Kinder",typ:"Substantiv"}, //PLURAL
	{ltW:"ēducāre, -ō",deW:"erziehen",typ:"Verb"},
	{ltW:"puer, -erī", genus:"m",deW:"der Junge, der Knabe",typ:"Substantiv"},
	{ltW:"pater, patris", genus:"m",deW:"der Vater",typ:"Substantiv"}, //Gen Pl -trum
	{ltW:"anteā",deW:"früher",typ:"Adverb"},
	{ltW:"puella, -ae", genus:"f",deW:"das Mädchen",typ:"Substantiv"},
	{ltW:"iuvāre, -ō, iūvī, iūtum, iuvātūrus",deW:"helfen",typ:"Verb"},
	{ltW:"pārentēs , -tium", genus:"m",deW:"die Eltern",typ:"Substantiv"}, //PLURAL
	//{ltW:"ante", mit:"Akk",deW:"vor",typ:"Präposition"},
	{ltW:"annus, -ī", genus:"m",deW:"das Jahr",typ:"Substantiv"}
  ];  
   var wortliste9 = [
	{ltW:"nam",deW:"denn, nämlich",typ:"Konjunktion"},
	{ltW:"appārēre, appāreō, appāruī, appāritūrus",deW:"erscheinen, sich zeigen",typ:"Verb"},//ap-pāreō <pārēre, pāruī, (pāritūrus)>
	{ltW:"appellāre, -ō",deW:"anreden, nennen, benennen",typ:"Verb"},
	{ltW:"turba, -ae", genus:"f",deW:"die (Menschen-)Menge, die Verwirrung, das Durcheinander",typ:"Substantiv"},
	{ltW:"prōmittere, prōmittō, prōmīsī, prōmissum",deW:"versprechen",typ:"Verb"}, // kons. //infinitive mit 3 t????
	{ltW:"deus, -ī", genus:"m",deW:"der Gott",typ:"Substantiv"},
	{ltW:"dea, -ae", genus:"f",deW:"die Göttin",typ:"Substantiv"},
	{ltW:"homō, hominis", genus:"m",deW:"der Mensch",typ:"Substantiv"}, 
	{ltW:"plaudere, plaudō, plausī, plausum",deW:"Beifall klatschen",typ:"Verb"}, // kons. intransitiv
	{ltW:"salūtāre, -ō",deW:"grüßen",typ:"Verb"},
	{ltW:"clāmor -ōris", genus:"m",deW:"das Geschrei",typ:"Substantiv"},
	{ltW:"enim",deW:"nämlich",typ:"Konjunktion"},
	{ltW:"rīdēre, rīdeō, rīsī, rīsum",deW:"lachen",typ:"Verb"}, //,hint:"unregelmäßig"unregelmäßig
	{ltW:"placēre, placeō, placuī, placitum",deW:"gefallen",typ:"Verb"}, //regelmäßig
	{ltW:"quō?",deW:"wohin?",typ:"Interrogativadverb"},// in anderer Bedeutung:Konjunktion/?
	{ltW:"basilica, -ae", genus:"f",deW:"die Basilika, die Kirche",typ:"Substantiv"},  
	{ltW:"agere, agō, ēgī, āctum",deW:"treiben, betreiben, handeln, verhandeln",typ:"Verb"}, // kons.
	{ltW:"causam agere",deW:"einen Prozess führen",typ:"Verbalphrase"},
	{ltW:"prō", mit:"Abl",deW:"vor, für, anstelle (von)",typ:"Präposition"},
	{ltW:"quid?",deW:"was?",typ:"Interrogativpronomen"},
	{ltW:"sedēre, sedeō, sēdī, sessum",deW:"sitzen",typ:"Verb"}, //unregelmäßig,hint:"unregelmäßig"
	{ltW:"ut",deW:"wie",typ:"Adverb"},
	{ltW:"cūr?",deW:"warum?",typ:"Interrogativadverb"},
	{ltW:"prīmus, -a, -um",deW:"der erste",typ:"Adjektiv"},
	{ltW:"summus, -a, -um",deW:"der höchste, der oberste",typ:"Adjektiv"},
	{ltW:"quis?",deW:"wer?",typ:"Interrogativpronomen"}
  ]; 
//mortuus, -a, -um	tot
//primus, -a, -um	der Erste
//summus, -a, -um	zuoberst, auf der Spitze
   var wortliste10 = [  // Lektion 24a
	{ltW:"postquam", ltCom:"mit Ind. Per.", mit:"Ind. Per.",deW:"nachdem",typ:"Konjunktion"}, // auf Deutsch mit Plusquamperfekt
	{ltW:"rēx, rēgis", genus:"m",deW:"der König",typ:"Substantiv"},
	{ltW:"lēx, lēgis", genus:"f",deW:"das Gesetz",typ:"Substantiv"},
	{ltW:"ēnūntiāre, -ō",deW:"aussagen, aussprechen",typ:"Verb"},
	{ltW:"plēbs, plēbis", genus:"f",deW:"die Plebs, das Bauernvolk, der Pöbel",typ:"Substantiv"},
	{ltW:"indīgnātus, -a, -um",deW:"empört",typ:"Adjektiv"},
	{ltW:"cēdere, cēdō, cessī, cessum",deW:"weichen, abtreten, hinausgehen",typ:"Verb"},
	{ltW:"scrībere, scrībō, scrīpsī, scrīptum",deW:"schreiben",typ:"Verb"},
	{ltW:"tōtus, -a, -um",deW:"ganz, gesamt",typ:"Adjektiv"},
	{ltW:"poscere, poscō, poposcī, -",deW:"fordern, verlangen",typ:"Verb"},
	{ltW:"requīrere, requīrō, requīsīvī, requīsītum",deW:"verlangen, erfordern, aufsuchen",typ:"Verb"},
	{ltW:"ideō",deW:"deshalb, deswegen",typ:"Adverb"},
	{ltW:"lēgātus -ī", genus:"m",deW:"der Abgesandte",typ:"Substantiv"},
	{ltW:"Graecia, -ae", genus:"f",deW:"Griechenland",typ:"Substantiv"}, //??nomen
	{ltW:"prūdentia, -ae", genus:"f",deW:"die Klugheit",typ:"Substantiv"},
	{ltW:"iam",deW:"schon, bereits",typ:"Adverb"},
	{ltW:"cīvitās, -ātis", genus:"f",deW:"der Bürger, das Bürgertum",typ:"Substantiv"},
	{ltW:"ratus, -a, -um",deW:"gültig",typ:"Adjektiv"},
	{ltW:"dēlēre, dēleō, dēlēvī, dēlētum",deW:"zerstören, vernichten",typ:"Verb"},
	{ltW:"crēdere, crēdō, crēdidī, crēditum",deW:"glauben, anvertrauen",typ:"Verb"},	
	{ltW:"revertere, reverto, revertī, reversum",deW:"zurückkehren, umkehren",typ:"Verb"} //re-verto <vertī (vortī), versum (vorsum), revertere>, re-vertor <vertī, Perf. revertī> (nicht klass. reversus sum; Part, Perf [auch klass. ] reversus)
  ]; 
   var wortliste11 = [  // Lektion 24b
	{ltW:"nōndum",deW:"noch nicht",typ:"Adverb"},
	{ltW:"fortasse",deW:"vielleicht",typ:"Adverb"},
	{ltW:"sine", ltCom:"mit Abl.", mit:"Abl",deW:"ohne",typ:"Präposition"},
	{ltW:"intellegere, intellegō, intellēxī, intellēctum",deW:"erkennen, verstehen, einsehen",typ:"Verb"},
	{ltW:"dum",deW:"während",typ:"Konjunktion"},
	{ltW:"petere, petō, petīvī, petītum",ltCom:"mit Akk.", mit:"Akk.",deW:"aufsuchen, angreifen, verlangen, bitten",typ:"Verb"},//petō <petere, petīvī (petiī), petītum> (m. Akk), (auch synk. Perf.-Formen: petīsse (m) = petīvisse(m), petīstī = petīvistī u. Ä.)
	{ltW:"vacāre, -ō", ltCom:"mit Abl.",mit:"Abl",deW:"frei sein (von etw.), (etw.) nicht haben",typ:"Verb"},
	{ltW:"occīdere, occīdō , occīdī, occīsum",deW:"töten, niederschlagen",typ:"Verb"},
	{ltW:"tamen",deW:"dennoch, doch, trotzdem",typ:"Partikel"}, //??wortart
	{ltW:"dubitāre, -ō",deW:"zögern, zweifeln",typ:"Verb"},
	{ltW:"observāre, -ō",deW:"beobachten, einhalten",typ:"Verb"},
	{ltW:"tandem",deW:"endlich, schließlich",typ:"Adverb"},
	{ltW:"malus, -a, -um",deW:"schlecht, schlimm, böse",typ:"Adjektiv"},
	{ltW:"hīc",deW:"hier",typ:"Adverb"},
	{ltW:"locus, -ī", genus:"m",ltCom:["im Singular","Plural: siehe locī, -orum und loca, -orum"], nursingular:"1",deW:"der Ort, der Platz, die Stelle",typ:"Substantiv"},
	{ltW:"locī, -orum", genus:"m",deW:"Stellen (in Büchern)",typ:"Substantiv"},
	{ltW:"loca, -orum", genus:"n",deW:"Orte, Gegenden",typ:"Substantiv"},
	{ltW:"cavēre, caveō, cāvī, cautum",deW:"sich in Acht nehmen, sich hüten (vor)",typ:"Verb"},
	{ltW:"neque enim",deW:"denn nicht",typ:"Phrase"},
	{ltW:"vulnerāre, -ō",deW:"verwunden",typ:"Verb"},
	{ltW:"dē", ltCom:"mit Abl.",mit:"Abl",deW:"von, von...herab, über",typ:"Präposition"},
	{ltW:"dēlīberāre, -ō",deW:"erwägen, überlegen",typ:"Verb"},
	{ltW:"dēlīberāre, -ō",ltCom:"mit Infinitiv",mit:"Infinitiv",deW:"sich entscheiden, beschließen",typ:"Verb"}	//?
  ]; 
   var wortliste12 = [  // Lektion 28a
	{ltW:"rēs, reī", genus:"f",deW:"die Sache, das Ding",typ:"Substantiv"},
	{ltW:"pūblicus, -a, -um",deW:"öffentlich",typ:"Adjektiv"},
	{ltW:"rēs pūblica", genus:"f",deW:"der Staat, die Republik	",typ:"Substantiv"},
	{ltW:"mūtāre, -ō",deW:"ändern, verändern",typ:"Verb"},
	{ltW:"quia",deW:"weil",typ:"Konjunktion"},
	{ltW:"fidēs, -eī", genus:"f",deW:"das Vertrauen, die Treue",typ:"Substantiv"},
	{ltW:"cīvis, -is", ltCom:"Gen. Pl. -ium", genus:" m./f.",deW:"der Bürger, die Bürgerin",typ:"Substantiv"},
	{ltW:"āmittere, āmittō, āmīsī, āmissum",deW:"verlieren, weglassen, loslassen",typ:"Verb"},
	{ltW:"senātor -ōris", genus:"m",deW:"der Senator",typ:"Substantiv"},
	{ltW:"tribūnus, -ī", genus:"m",deW:"der Tribun",typ:"Substantiv"},
	{ltW:"-que", ltCom:"angehängt",deW:"und",typ:"Konjunktion"},
	{ltW:"creāre, -ō", ltCom:"mit doppeltem Akkusativ",mit:"doppeltem Akkusativ",deW:"wählen zu",typ:"Verb"},
	{ltW:"magistrātus, ūs", genus:"m",deW:"das Amt, Beamter",typ:"Substantiv"},
	{ltW:"valēre, valeō, valuī, valitūrus",deW:"Einfluss haben, gesund/stark sein, gelten",typ:"Verb"},
	{ltW:"auctōritās, -ātis", genus:"f",deW:"das Ansehen, der Einfluss",typ:"Substantiv"},
	{ltW:"spēs, speī", genus:"f",deW:"die Hoffnung, die Erwartung",typ:"Substantiv"},
	{ltW:"augēre, augeō, auxī, auctum",deW:"steigern, vergrößern",typ:"Verb"},
	{ltW:"homō, hominis", genus:"m",deW:"der Mensch",typ:"Substantiv"},
	{ltW:"agere, agō, ēgī, āctum",deW:"handeln, behandeln, treiben, betreiben, tun	",typ:"Verb"},
	{ltW:"vītam agere",deW:"ein Leben führen",typ:"Verbalphrase"},
	{ltW:"pāx, pācis", genus:"f",deW:"der Friede",typ:"Substantiv"},
	{ltW:"imperium, -ī", genus:"n",deW:"das Reich",typ:"Substantiv"},
	{ltW:"is, ea, id",deW:"er, sie, es; dieser, diese, dieses (was vorher genannt wurde); derjenige, diejenige, dasjenige",typ:"Demonstrativ- u. Personalpronomen"},
	{ltW:"hic, haec, hoc", genus:"mfn",deW:"dieser, diese, dieses (was den Sprecher betrifft)",typ:"Demonstrativpronomen"} //???
  ];
   var wortliste13 = [  // Lektion 28b
	{ltW:"unde",deW:"woher",typ:"Adverb"},
	{ltW:"īra, -ae", genus:"f",deW:"der Zorn",typ:"Substantiv"},
	{ltW:"lībertus, -ī", genus:"m",deW:"Freigelassener",typ:"Substantiv"},
	{ltW:"mercātor, -ōris", genus:"m",deW:"der Kaufmann",typ:"Substantiv"},
	{ltW:"inter", ltCom:"mit Akk.",mit:"Akk",deW:"zwischen, unter, während",typ:"Präposition"},
	{ltW:"fīlius, -ī", genus:"m",deW:"der Sohn",typ:"Substantiv"},
	{ltW:"fīlia, -ae", genus:"f",deW:"die Tochter",typ:"Substantiv"},
	{ltW:"honestus, -a, -um",deW:"angesehen, ehrenhaft, anständig",typ:"Adjektiv"},
	{ltW:"nihil, nīl", genus:"n", ltCom:"als Nom. und Akk. (Gen., Dat. und Abl. ergänzt durch: nullius rei, nulli rei, nulla re",deW:"nichts",typ:"Substantiv"}, //???
	{ltW:"tacēre, taceō, tacuī, tacitum",deW:"schweigen",typ:"Verb"},
	{ltW:"pārēre, pāreō, pāruī, -",deW:"gehorchen",typ:"Verb"},//pāreō <pārēre, pāruī, (pāritūrus)
	{ltW:"nōn  dēbēre",deW:"nicht dürfen",typ:"Verbalphrase"},
	{ltW:"vix",deW:"kaum",typ:"Adverb"},
	{ltW:"tenēre, teneō, tenuī, tentum",deW:"halten, festhalten",typ:"Verb"},
	{ltW:"familia, -ae", genus:"f",deW:"die Familie, die Hausgemeinschaft",typ:"Substantiv"},
	{ltW:"reprehendere, reprehendō, reprehendī, reprehensum",deW:"tadeln",typ:"Verb"},
	{ltW:"sermō, -ōnis", genus:"m",deW:"das Gespräch, die Sprache",typ:"Substantiv"},
	{ltW:"neque ... neque",deW:"weder ... noch",typ:"Konjunktion"},
	{ltW:"cūrāre, -ō", ltCom:"mit Akk.", mit:"Akk",deW:"besorgen, sorgen (für)",typ:"Verb"},
	{ltW:"igitur",deW:"folglich, daher, also",typ:"Konjunktion"},
	{ltW:"hospes, -pitis", genus:"m",deW:"der Gast, Fremder",typ:"Substantiv"},
	{ltW:"dēsinere, dēsinō, dēsiī, dēsitum",deW:"ablassen, aufhören",typ:"Verb"},
	{ltW:"diēs, diēī", genus:"m/f",deW:"der Tag (m), der Termin (f)",typ:"Substantiv"} //altl. Gen Sg diē diī, Dat diē m
  ];
   var wortliste14 = [  // Lektion 33a
	{ltW:"incolumis, -is, -e",deW:"heil, unverletzt",typ:"Adjektiv"},
	{ltW:"salūtāre, -ō",deW:"grüßen, begrüßen",typ:"Verb"},
	{ltW:"diēs fēstus", genus:"m",deW:"[das Fest,] der Festtag",typ:"Substantivphrase"}, //dies <-ei> m festus
	{ltW:"celebrāre, -ō",deW:"feiern",typ:"Verb"},
	{ltW:"hōra, -ae", genus:"f",deW:"die Stunde",typ:"Substantiv"},
	{ltW:"frūctus, -ūs", genus:"m",deW:"der Ertrag, die Frucht",typ:"Substantiv"},
	{ltW:"apportāre, -ō",deW:"herbeitragen, -bringen, -schaffen",typ:"Verb"},
	{ltW:"edere, edō, ēdī, ēsum",deW:"essen",typ:"Verb"},
	{ltW:"animus, -ī", genus:"m",deW:"die Seele, der Mut, der Geist, die Gesinnung",typ:"Substantiv"},
	{ltW:"bonō animō esse",deW:"guten Mutes sein, gut gelaunt sein",typ:"Verbalphrase"},
	{ltW:"lūctus, -ūs", genus:"m",deW:"die Trauer",typ:"Substantiv"},
	{ltW:"exercitus, -ūs", genus:"m",deW:"das Heer",typ:"Substantiv"},
	{ltW:"imprīmīs",deW:"besonders",typ:"Adverb"},
	{ltW:"vertere, vertō, vertī, versum",deW:"wenden, drehen",typ:"Verb"},
	{ltW:"tribuere, tribuō, tribuī, tribūtum",deW:"zuteilen, zuweisen",typ:"Verb"},
	{ltW:"mulier, -eris", genus:"f",deW:"die Frau",typ:"Substantiv"},
	{ltW:"trīstis, -is, -e",deW:"traurig",typ:"Adjektiv"},
	{ltW:"mors, mortis", genus:"f",deW:"der Tod",typ:"Substantiv"},
	{ltW:"omnis, -is, -e",deW:"alle, jeder",typ:"???"}, //adj?
	{ltW:"quod",deW:"da, weil",typ:"Konjunktion"}, // kann auch was anderes sein	
	{ltW:"praesidium, -ī", genus:"n",deW:"der Schutz, die Hilfe",typ:"Substantiv"},
	{ltW:"relinquere, relinquō, relīquī, relictum",deW:"zurücklassen, aufgeben, verlassen",typ:"Verb"},
	{ltW:"ūsus, -ūs", genus:"m",deW:"der Nutzen, der Gebrauch, der Bedarf",typ:"Substantiv"},
	{ltW:"inops, inopis",deW:"hilflos, arm",typ:"Adjektiv"},
	{ltW:"gravis, -is, -e",deW:"schwer",typ:"Adjektiv"}, //. gravis <e> is, e+adj statt is,is, e!? 
	{ltW:"imperium, -ī", genus:"n",deW:"das Reich",typ:"Substantiv"},
	{ltW:"facere, faciō, fēcī, factum",deW:"tun, machen, erledigen",typ:"Verb"},
	{ltW:"vendere, vendō, vendidī, venditum",deW:"verkaufen",typ:"Verb"}
  ]; 
   var wortliste15 = [ // Lektion 33b
	{ltW:"per", ltCom:"mit Akk.", mit:"Akk",deW:"durch...hindurch, durch, über...hin",typ:"Präposition"},
	{ltW:"ambulāre, -ō",deW:"spazieren gehen",typ:"Verb"},
	{ltW:"ubīque",deW:"überall",typ:"Adverb"},
	{ltW:"quot",deW:"wie viele",typ:"Interrogativadverb"},// (adjektivisch, selten subst)
	{ltW:"quantus, -a, -um",deW:"wie groß, wie viel",typ:"Adjektiv"},
	{ltW:"tot",deW:"so viele",typ:"Zahlwort"}, //??
	{ltW:"bibliothēca, -ae", genus:"f",deW:"die Bibliothek",typ:"Substantiv"},
	{ltW:"legere, legō1, lēgī, lēctum",deW:"lesen, sammeln",typ:"Verb"},
	{ltW:"celer, celeris, celere",deW:"schnell, rasch",typ:"Adjektiv"},
	{ltW:"ācer, ācris, ācre",deW:"scharf, heftig, spitz",typ:"Adjektiv"},
	{ltW:"satis",deW:"genug",typ:"Adverb"},
	{ltW:"genū, -ūs", genus:"n",deW:"das Knie",typ:"Substantiv"}, // Dat. Sing. auch -ui ???
	{ltW:"dare, dō, dedī, datum",deW:"geben",typ:"Verb"},
	{ltW:"dēpōnere, dēpōnō, dēposuī, dēpositum",deW:"ablegen, niederlegen, aufgeben",typ:"Verb"},
	{ltW:"aqua, -ae", genus:"f",deW:"das Wasser",typ:"Substantiv"},
	{ltW:"spoliāre, -ō",deW:"rauben, wegnehmen, plündern",typ:"Verb"},
	{ltW:"nōn  iam",deW:"nicht mehr",typ:"???"}, //?phrase
	{ltW:"frūstrā",deW:"vergeblich",typ:"Adverb"}, // auch irrtümlich //frūstrā, frūstra (altl.)
	{ltW:"pārentēs, -tium", genus:"m",deW:"die Eltern",typ:"Substantiv"}, //Plural
	{ltW:"statim",deW:"sofort, auf der Stelle",typ:"Adverb"},
	{ltW:"invenīre, inveniō, invēnī, inventum",deW:"finden, erfinden",typ:"Verb"},
	{ltW:"quamquam",deW:"obwohl, obgleich",typ:"Konjunktion"},
	{ltW:"cornū, -ūs", genus:"n",deW:"das Horn",typ:"Substantiv"}, // Dat. Sing. auch -ui ???
	{ltW:"āra, -ae", genus:"f",deW:"der Altar",typ:"Substantiv"},
	{ltW:"ipse/ipsa/ipsum",ltCom:"Gen. ipsius, Dat. ipsi",deW:"selbst",typ:"???"}, //????
	{ltW:"pulcher, -chra, -chrum",deW:"schön, hübsch",typ:"Adjektiv"},
	{ltW:"honōs, honōris", ltCom:"bzw. honor, honōris", genus:"m",deW:"die Ehre, das Ehrenamt",typ:"Substantiv"}
  ];  //  "esse"+Dat+Dat erhält hier die Bedeutung "dienen zu, gereichen zu".
    var wortliste16 = [  // Lektion 35
// Zahlen
	{ltW:"ūnus, -a, -um",deW:"einer, ein, eins",typ:"Kardinalzahladjektiv"},
	{ltW:"duo, duae, duo",deW:"zwei",typ:"Kardinalzahladjektiv"},
	{ltW:"trēs, trēs, tria",deW:"drei",typ:"Kardinalzahladjektiv"}, //(Gen trium, Dat u. Abl tribus, Akk trēs u. trīs, nt tria)
	{ltW:"quattuor",deW:"vier",typ:"Kardinalzahladjektiv"}, //ADJ undekl
	{ltW:"quīnque1 ",deW:"fünf",typ:"Kardinalzahladjektiv"},
	{ltW:"sex",deW:"sechs",typ:"Kardinalzahladjektiv"},
	{ltW:"septem",deW:"sieben",typ:"Kardinalzahladjektiv"},
	{ltW:"octō",deW:"acht",typ:"Kardinalzahladjektiv"},
	{ltW:"novem",deW:"neun",typ:"Kardinalzahladjektiv"},
	{ltW:"decem",deW:"zehn",typ:"Kardinalzahladjektiv"},
	
	{ltW:"prīmus, -a, -um",deW:"erste/r/s",typ:"Ordinalzahladjektiv"},
	{ltW:"secundus, -a, -um",deW:"zweite/r/s",typ:"Ordinalzahladjektiv"},
	{ltW:"tertius, -a, -um",deW:"dritte/r/s",typ:"Ordinalzahladjektiv"},
	{ltW:"quārtus , -a, -um",deW:"vierte/r/s",typ:"Ordinalzahladjektiv"},
	{ltW:"quīntus , -a, -um",deW:"fünfte/r/s",typ:"Ordinalzahladjektiv"},
	{ltW:"sextus, -a, -um",deW:"sechste/r/s",typ:"Ordinalzahladjektiv"},
	{ltW:"septimus, -a, -um",deW:"siebente/r/s",typ:"Ordinalzahladjektiv"},
	{ltW:"octāvus , -a, -um",deW:"achte/r/s",typ:"Ordinalzahladjektiv"},
	{ltW:"nōnus, -a, -um",deW:"neunte/r/s",typ:"Ordinalzahladjektiv"},
	{ltW:"decimus, -a, -um",deW:"zehnte/r/s",typ:"Ordinalzahladjektiv"} //decimus, decumus
  ];  
  var wortliste17 = [  // Lektion 37a
	{ltW:"thermae, -ārum", genus:"f",deW:"Bäder, die Therme",typ:"Substantiv"}, //therma, -ae
	{ltW:"occurrere, occurrō, occurrī, occursum",deW:"begegnen, entgegenlaufen",typ:"Verb"},
	{ltW:"sermonem habēre",deW:"ein Gespräch führen",typ:"Verbalphrase"}, //sermonem betonungen?
	{ltW:"aliquis, aliqua, aliquid",deW:"irgendjemand, irgendetwas",typ:"Indefinitpronomen"},
	{ltW:"aliquis",deW:"irgendjemand",typ:"Indefinitpronomen"},
	{ltW:"aliquid",deW:"irgendetwas",typ:"Indefinitpronomen"},
	{ltW:"fūr, fūris", genus:"m",deW:"der Dieb",typ:"Substantiv"},
	{ltW:"capere, capiō, cēpī, captum",deW:"fassen, greifen, fangen",typ:"Verb"},
	{ltW:"negāre, -ō",deW:"verneinen, leugnen",typ:"Verb"},
	{ltW:"reddere, reddō, reddidī, redditum",deW:"wiedergeben, zurückgeben",typ:"Verb"}, ///, redidi, reditumßßßßßß????
	{ltW:"-ne",ltCom:"angehängt",deW:"?, (Fragesignal)",deCom:"unübersetzt",typ:"Partikel"}, // enklitische Fragepartikel (oft apokopiert zu -n, wobei auch ein davor stehendes s ausfällt: viden = videsne, ain = aisne, vin = visne, satin = satisne) in einfachen Fragen
	//zweite Hälfte
	{ltW:"ōrnāre, -ō",deW:"ausstatten, schmücken",typ:"Verb"},
	{ltW:"nepōs, -ōtis", genus:"m",deW:"der Enkel",typ:"Substantiv"},
	{ltW:"vīta cēdere (cēdō, cessī, cessum)",deW:"sterben",typ:"Verbalphrase"},
	{ltW:"adulēscēns, -centis",ltCom:"Gen.Pl. adulescentium???", genus:"m",deW:"junger Mann",typ:"Substantiv"},
	{ltW:"post", ltCom:"mit Akk.",mit:"Akk",deW:"nach, hinter",typ:"Präposition"},
	{ltW:"mors, mortis", genus:"f",deW:"der Tod",typ:"Substantiv"},
	{ltW:"nōnnūllī, -ae, -a",deW:"einige, manche",typ:"Adjektiv"}, //????
	{ltW:"līber, -era, -erum",deW:"frei, unabhängig",typ:"Adjektiv"},
	{ltW:"nex, necis", genus:"f",deW:"der	Mord, der Tod",typ:"Substantiv"},
	{ltW:"parvus, -a, -um",deW:"klein, gering",typ:"Adjektiv"},
	{ltW:"trānsportāre, -ō",deW:"hinüberbringen, hinüberschaffen",typ:"Verb"},
	{ltW:"miser, -era, -erum",deW:"elend, unglücklich, armselig",typ:"Adjektiv"},
	{ltW:"paucī, -ae, -a",deW:"wenige",typ:"Adjektiv"}, // plural von paucus
	{ltW:"post",deW:"später, darauf",typ:"Adverb"},
	{ltW:"venia, -ae", genus:"f",deW:"die Verzeihung, die Nachsicht",typ:"Substantiv"},
	{ltW:"immō (vērō)",deW:"ja sogar, vielmehr, im Gegenteil",typ:"Adverb"}, // immo vero verstärkt
	{ltW:"vērō",deW:"wirklich, tatsächlich; aber",typ:"Adverb"},//wirklich, tatsächlich
	{ltW:"tam",deW:"so",typ:"Adverb"},
	{ltW:"sevērus , -a, -um",deW:"ernst, streng",typ:"Adjektiv"},
	{ltW:"aliter",deW:"anders, sonst",typ:"Adverb"},
	{ltW:"nox, noctis",ltCom:"???Gen.Pl. noctium", genus:"f",deW:"die Nacht",typ:"Substantiv"},
	{ltW:"somnus, -ī", genus:"m",deW:"der Schlaf",typ:"Substantiv"},
	{ltW:"sē somnō dare",deW:"sich schlafen legen",typ:"Verbalphrase"},
	{ltW:"imāgō, -inis", genus:"f",deW:"das Bild, das Abbild",typ:"Substantiv"},
	{ltW:"fugere, fugiō, fūgī, fugitum",deW:"fliehen, meiden",typ:"Verb"}, //fugitūrus ohne PPP(pons, navigium, aber nicht latinum)
	{ltW:"hostis, hostis",ltCom:"Gen. Pl. hostium", genus:"m",deW:"der Feind",typ:"Substantiv"},
	{ltW:"mūrus, -ī", genus:"m",deW:"die Mauer",typ:"Substantiv"},
	{ltW:"sacrum, -ī", genus:"n",deW:"das Heiligtum, das Opfer",typ:"Substantiv"},
	{ltW:"iacere, iaciō, iēcī, iactum",deW:"werfen, schleudern",typ:"Verb"},
	{ltW:"tēlum, -ī", genus:"n",deW:"das Geschoss, die Waffe",typ:"Substantiv"},//(Wurf-)Waffe
	{ltW:"virgō, -ginis", genus:"f",deW:"das Mädchen, junge Frau",typ:"Substantiv"},
	{ltW:"rapere, rapiō, rapuī, raptum",deW:"rauben, fortreißen",typ:"Verb"},
	{ltW:"senex, senis", genus:"m",deW:"Adj: alt; Sub: alter Mann, der Greis",typ:"Adjektiv/Substantiv"},
	{ltW:"senex, senis", genus:"m",deW:"alt",typ:"Adjektiv"},
	{ltW:"senex, senis", genus:"m",deW:"alter Mann, der Greis",typ:"Substantiv"},
	{ltW:"aspicere, aspiciō, aspexī, aspectum",deW:"erblicken, ansehen",typ:"Verb"},
	{ltW:"arx, arcis (Gen.Pl arcium)", genus:"f",deW:"die Burg",typ:"Substantiv"},
	{ltW:"malum, -ī", genus:"n",deW:"das Übel, das Leid",typ:"Substantiv"},
	{ltW:"verbum, -ī", genus:"n",deW:"das Wort",typ:"Substantiv"},
	{ltW:"movēre, moveō, mōvī, mōtum",deW:"bewegen, erregen, beinflussen",typ:"Verb"},
	{ltW:"flamma, -ae", genus:"f",deW:"die Flamme",typ:"Substantiv"},
	{ltW:"sīgnum, -ī", genus:"n",deW:"das Zeichen, das Merkmal",typ:"Substantiv"},
	{ltW:"monere",deW:"mahnen, auffordern, erinnern, warnen",typ:"Verb"}//moneō <monēre, monuī, monitum
  ]; 
    var wortliste18 = [  // extra wörter
	{ltW:"ūtilis, -is, -e",deW:"nützlich",typ:"Adjektiv"},//is,e
	{ltW:"ingēns, ingentis",deW:"ungeheuer, gewaltig",typ:"Adjektiv"},
	{ltW:"dīves, dīvitis",deW:"reich, fruchtbar",typ:"Adjektiv"},
	{ltW:"mōs, mōris", genus:"m",deW:"die Sitte, die Gewohnheit, der Brauch",typ:"Substantiv"},
	{ltW:"sōl,sōlis", genus:"m",deW:"die Sonne",typ:"Substantiv"},
	{ltW:"aetās, -ātis", genus:"f",deW:"das Lebensalter, das Zeitalter",typ:"Substantiv"},
	{ltW:"lūx, lūcis", genus:"f",deW:"das Licht",typ:"Substantiv"},
	{ltW:"sīdus, -eris", genus:"n",deW:"das Sternbild, das Gestirn",typ:"Substantiv"},//-deris
	{ltW:"carmen, -minis", genus:"n",deW:"das Lied, das Gedicht, der Zauberspruch",typ:"Substantiv"},
	{ltW:"nāvis, -is", genus:"f",deW:"das Schiff",typ:"Substantiv"},
	{ltW:"terra, -ae", genus:"f",deW:"die Erde, das Land",typ:"Substantiv"},
	{ltW:"manus, -ūs", genus:"f",deW:"die Hand",typ:"Substantiv"},
	{ltW:"domus, -ūs", genus:"f",deW:"das Haus",typ:"Substantiv"}
  ];
  function formatArticle(s) {
  var tag="artikel";
  s=s.replace(/(, |; |^|\/)(der |die |das )/gi, "$1<"+tag+">$2</"+tag+">");
  return s;
  }
  function formatREArtikel(s) {
  s=s.replace(/(, |; |^|\/)(der |die |das )/gi, "$1($2)");
  return s;
  }
  function formatDots(s) {
  s=s.replace(/\.\.\./gi, "");
  s = s.replace(/\s\s+/g, ' ');
  return s;
  }
  function formatREbrackcorr(s) {
	return s.replace(/\) /g, " )");
  }
  function formatREbrackopt(s) {
	return s.replace(/\((.*?)\)/g, "(?:$1)?");
  }
  
  function lvokalIndex(s) {
	var s2, i1, i2, i3, i4, i5, i;
	s2 = unstress(s);
	i1 = s2.lastIndexOf("a");
	i2 = s2.lastIndexOf("e");
	i3 = s2.lastIndexOf("i");
	i4 = s2.lastIndexOf("o");
	i5 = s2.lastIndexOf("u");
	i = Math.max(i1,i2,i3,i4,i5);
	return i;
}
  function shortVok(ch) {
	if (ch=="a"|ch=="ā") {
		return "á";
	} else if (ch=="e"|ch=="ē") {
		return "é";
	} else if (ch=="i"|ch=="ī") {
		return "í";
	} else if (ch=="o"|ch=="ō") {
		return "ó";
	} else if (ch=="u"|ch=="ū") {
		return "ú";
	}
}
  function shortLastVokal(s) {
	var i;
	i = lvokalIndex(s);
	if (i<0|i > s.length-1) {
		return s
	} else {
		return s.substr(0,i) + shortVok(s[i]) + s.substr(i+1);
	}
}
var DeklinationstabNomen = [
  {
    Deklination: "Deklination",
	head: { Kasus: "Kasus", Singular: "Singular", Plural: "Plural"},
	Nominativ: {Kasus: "Nominativ", Singular: "", Plural: ""},
	Genitiv: {Kasus: "Nominativ", Singular: "", Plural: ""},
	Dativ: {Kasus: "Nominativ", Singular: "", Plural: ""},
	Akkusativ: {Kasus: "Nominativ", Singular: "", Plural: ""},
	Ablativ: {Kasus: "Nominativ", Singular: "", Plural: ""},
  }
  ];
  
   var DeklinationstabNomen = [
	[{id:"colKasus", text:"Kasus", type:2},     {id:"colSing", text:"Singular", type:2}, {id:"colPlur", text:"Plural", type:2}],
	[{id:"rowNom", text:"Nominativ", type:2},   {id:"SingNom", text:""}, {id:"PlurNom", text:""}],
	[{id:"rowGen", text:"Genitiv", type:2},     {id:"SingGen", text:""}, {id:"PlurGen", text:""}],
	[{id:"rowDat", text:"Dativ", type:2},       {id:"SingDat", text:""}, {id:"PlurDat", text:""}],
	[{id:"rowAkk", text:"Akkusativ", type:2},   {id:"SingAkk", text:""}, {id:"PlurAkk", text:""}],
	[{id:"rowAbl", text:"Ablativ", type:2},     {id:"SingAbl", text:""}, {id:"PlurAbl", text:""}],
  ];

   var Vokabellistetab = [
	[{id:"colLektionen", text:"Lektionen", type:2},   {id:"colVokabeln", text:"Vokabeln", type:2}],/**/
	[{id:"Lektionen", text:'<div id="lektion-select"><input id="inVokabelnLektionen" type="hidden" name="events" value=""><ul class="select" id="ulVokabelnLektionen"  tabindex="1", inputid="inVokabelnLektionen">  <li>keine Einträge</li>  </ul></div>', type:1},       {id:"Vokabeln", text:'<div id="voc-select"><input id="inVokabelnVokabeln" type="hidden" name="events" value=""><ul class="select" id="ulVokabelnVokabeln"  tabindex="1", inputid="inVokabelnVokabeln">  <li>keine Einträge</li>  </ul></div>', type:1}],
     [{id:"VListSummary", text:'<div id="voc-msg"></div>', colspan:2}],
/*	[{id:"Abfragen", text:'<div id="msg">dddd</div>', colspan:2, type:5}], */
	[{id:"Abfragen", text:'<div class="button-pane"><input type="button" value="Abfragen" name="inVokabelnAbfragen" id="inVokabelnAbfragen"><input type="reset" id="register-form-reset" value="Neue Vokabel"/><input type="button" id="edit-voc-button" value="Vokabel bearbeiten"/><input type="button" class="destructive" id="delete-button" value="Vokabel entfernen" /></div><span  id="msg"></span><input type="button" id="test-button" value="Test"/>', colspan:2}],
  ];

  var Abfragetab = [
	[{id:"rowFrage", text:"Wort", type:2},   {id:"frage", text:""}],
	[{id:"rowAntwort", text:"Bedeutung", type:2},       {id:"antwort", text:"", type:3}],
	[{id:"rowHinweis", text:"Hinweis", type:2},   {id:"hinweis", text:""}],
	[{id:"buttons", text:"", colspan:2, type:6}],
  ];
  
   var Infotab = [
	[{id:"rowWort", text:"Vokabel", type:2},   {id:"latX", text:"<div id='outwArtlat'></div><div id='outwArttype'></div>"}],
	//[{id:"rowWortart", text:"Wortart", type:2},     {id:"type", text:""}],
	[{id:"rowGenus", text:"Genus", type:2},     {id:"genus", text:""}],
	[{id:"rowBedeutung", text:"Bedeutung", type:2},       {id:"de", text:""}],
  ];
  
    var Ergebnistab = [
/*	[{id:"colAufAnhieb", text:"Gekonnt", type:2},   {id:"colGewusst", text:"Unsicher", type:2},   {id:"colNGewusst", text:"Nicht gewusst", type:2}],
	[{id:"AufAnhieb", text:'<select id="rAntwortenSelect" size="10" onchange="selDeklinieren(this)"></select>'},     {id:"Gewusst", text:'<select id="lAntwortenSelect" size="10" onchange="selDeklinieren(this)"></select>'},     {id:"NGewusst", text:'<select id="fAntwortenSelect" size="10" onchange="selDeklinieren(this)"></select>'}], */
		[{id:"Resultate", text:'<div id="voc-result"><input id="inAntwortenResult" type="hidden" name="events" value=""><ul class="select" id="ulAntwortenResult"  tabindex="1", inputid="inAntwortenResult">  <li class="op_header">Gekonnt</li> <div id="inAntwortenResultAufAnhieb"></div><li class="empty"></li><li class="op_header">Unsicher</li> <div id="inAntwortenResultUnsicher"></div><li class="empty"></li><li class="op_header">Nicht gewusst</li> <div id="inAntwortenResultNichtGewusst"></div>  </ul></div>', colspan:3}],
		[{id:"Lektionen", text:"", colspan:3, type:5}],
  ];
 function sModus(s) {
      return '<ul><li class="has-sub"><a onclick="void(0)" onmouseover="opMenu(this)">'+s+'</a>					<ul><li><a onclick="selModus(this,\'Aktiv\')">Aktiv</a></li><li><a onclick="selModus(this,\'Passiv\')">Passiv</a></li></ul></li></ul>';
    }  
    function sGenus(s) {
      return '<ul><li class="has-sub"><a onclick="void(0)" onmouseover="opMenu(this)">'+s+'</a>					<ul><li><a onclick="selGenus(this,\'M\')">maskulinum</a></li><li><a onclick="selGenus(this,\'F\')">femininum</a></li><li><a onclick="selGenus(this,\'N\')">neutrum</a></li></ul></li></ul>';
    }

function sPartizip(s) {
  return '<ul><li class="has-sub"><a onclick="void(0)" onmouseover="opMenu(this)">'+s+'</a>					<ul><li><a onclick="selPartizip(this,\'rowPPA\')">Partizip Präsens Aktiv</a></li><li><a onclick="selPartizip(this,\'rowPPP\')">Partizip Perfekt Passiv</a></li><li><a onclick="selPartizip(this,\'rowPFA\')">Partizip Futur Aktiv</a></li><li><a onclick="selPartizip(this,\'rowGer\')">Gerundivum</a></li></ul></li></ul>'
}
function sTempus(s) {
  return '<ul><li class="has-sub"><a onclick="void(0)" onmouseover="opMenu(this)">'+s+'</a>					<ul><li><a onclick="selTempus(this,\'Präsens\')">Präsens</a></li><li><a onclick="selTempus(this,\'Imperfekt\')">Imperfekt</a></li><li><a onclick="selTempus(this,\'Perfekt\')">Perfekt</a></li><li><a onclick="selTempus(this,\'Plusquamperfekt\')">Plusquamperfekt</a></li><li><a onclick="selTempus(this,\'Futur I\')">Futur I</a></li><li><a onclick="selTempus(this,\'Futur II\')">Futur II</a></li></ul></li></ul>'
}
var Konjugationstab = [
	[{id:"empty1", text:"", colspan:1, type:2},
   {id:"empty2", text:"", colspan:1, type:2},
   {id:"empty3", text:"", colspan:1, type:2},     
   {id:"colAktiv", text:sModus("Aktiv"), colspan:2, type:2}, {type:0},	{id:"colPassiv", text:sModus("Passiv"), colspan:2, type:2}, {type:0}],
	[{id:"colTempus", text:"Tempus", short:"Temp.", type:2},     {id:"colNumerus", text:"Numerus", short:"Num.", type:2},     {id:"colPerson", text:"Person", short:"Pers.", type:2}, {id:"colIndAkt", text:"Indikativ", type:2}, {id:"colKonAkt", text:"Konjunktiv", type:2}, {id:"colIndPas", text:"Indikativ", type:2}, {id:"colKonPas", text:"Konjunktiv", type:2}],
	[{id:"Präsens", text:sTempus("Präsens"), rot:1, type:2, rowspan: 6},     {id:"rowPraesSing", text:"Singular", short:"Sing.", rowspan:3, type:2},     {id:"row1PersSingPraes", text:"1.", type:2}, {id:"1SingIndPraesAkt", text:""}, {id:"1SingKonPraesAkt", text:""}, {id:"1SingIndPraesPas", text:""}, {id:"1SingKonPraesPas", text:""}],
	[{type:0}, {type:0},    {id:"row2PersSingPraes", text:"2.", type:2}, {id:"2SingIndPraesAkt", text:""}, {id:"2SingKonPraesAkt", text:""}, {id:"2SingIndPraesPas", text:""}, {id:"2SingKonPraesPas", text:""}],
	[{type:0}, {type:0},    {id:"row3PersSingPraes", text:"3.", type:2}, {id:"3SingIndPraesAkt", text:""}, {id:"3SingKonPraesAkt", text:""}, {id:"3SingIndPraesPas", text:""}, {id:"3SingKonPraesPas", text:""}],
	[{type:0}, {id:"rowPraesPlur", text:"Plural", short:"Plur.", rowspan:3, type:2},     {id:"row1PersPlurPraes", text:"1.", type:2}, {id:"1PlurIndPraesAkt", text:""}, {id:"1PlurKonPraesAkt", text:""}, {id:"1PlurIndPraesPas", text:""}, {id:"1PlurKonPraesPas", text:""}],
	[{type:0}, {type:0},    {id:"row2PersPlurPraes", text:"2.", type:2}, {id:"2PlurIndPraesAkt", text:""}, {id:"2PlurKonPraesAkt", text:""}, {id:"2PlurIndPraesPas", text:""}, {id:"2PlurKonPraesPas", text:""}],
	[{type:0}, {type:0},    {id:"row3PersPlurPraes", text:"3.", type:2}, {id:"3PlurIndPraesAkt", text:""}, {id:"3PlurKonPraesAkt", text:""}, {id:"3PlurIndPraesPas", text:""}, {id:"3PlurKonPraesPas", text:""}],
	[{id:"Imperfekt", text:sTempus("Imperfekt"), rot:1, type:2, rowspan: 6},     {id:"rowImperSing", text:"Singular", short:"Sing.", rowspan:3, type:2},     {id:"row1PersSingImper", text:"1.", type:2}, {id:"1SingIndImperAkt", text:""}, {id:"1SingKonImperAkt", text:""}, {id:"1SingIndImperPas", text:""}, {id:"1SingKonImperPas", text:""}],
	[{type:0}, {type:0},    {id:"row2PersSingImper", text:"2.", type:2}, {id:"2SingIndImperAkt", text:""}, {id:"2SingKonImperAkt", text:""}, {id:"2SingIndImperPas", text:""}, {id:"2SingKonImperPas", text:""}],
	[{type:0}, {type:0},    {id:"row3PersSingImper", text:"3.", type:2}, {id:"3SingIndImperAkt", text:""}, {id:"3SingKonImperAkt", text:""}, {id:"3SingIndImperPas", text:""}, {id:"3SingKonImperPas", text:""}],
	[{type:0}, {id:"rowImperPlur", text:"Plural", short:"Plur.", rowspan:3, type:2},     {id:"row1PersPlurImper", text:"1.", type:2}, {id:"1PlurIndImperAkt", text:""}, {id:"1PlurKonImperAkt", text:""}, {id:"1PlurIndImperPas", text:""}, {id:"1PlurKonImperPas", text:""}],
	[{type:0}, {type:0},    {id:"row2PersPlurImper", text:"2.", type:2}, {id:"2PlurIndImperAkt", text:""}, {id:"2PlurKonImperAkt", text:""}, {id:"2PlurIndImperPas", text:""}, {id:"2PlurKonImperPas", text:""}],
	[{type:0}, {type:0},    {id:"row3PersPlurImper", text:"3.", type:2}, {id:"3PlurIndImperAkt", text:""}, {id:"3PlurKonImperAkt", text:""}, {id:"3PlurIndImperPas", text:""}, {id:"3PlurKonImperPas", text:""}],
	[{id:"Perfekt", text:sTempus("Perfekt"), rot:1, type:2, rowspan: 6},     {id:"rowPerfeSing", text:"Singular", short:"Sing.", rowspan:3, type:2},     {id:"row1PersSingPerfe", text:"1.", type:2}, {id:"1SingIndPerfeAkt", text:""}, {id:"1SingKonPerfeAkt", text:""}, {id:"1SingIndPerfePas", text:""}, {id:"1SingKonPerfePas", text:""}],
	[{type:0}, {type:0},    {id:"row2PersSingPerfe", text:"2.", type:2}, {id:"2SingIndPerfeAkt", text:""}, {id:"2SingKonPerfeAkt", text:""}, {id:"2SingIndPerfePas", text:""}, {id:"2SingKonPerfePas", text:""}],
	[{type:0}, {type:0},    {id:"row3PersSingPerfe", text:"3.", type:2}, {id:"3SingIndPerfeAkt", text:""}, {id:"3SingKonPerfeAkt", text:""}, {id:"3SingIndPerfePas", text:""}, {id:"3SingKonPerfePas", text:""}],
	[{type:0}, {id:"rowPerfePlur", text:"Plural", short:"Plur.", rowspan:3, type:2},     {id:"row1PersPlurPerfe", text:"1.", type:2}, {id:"1PlurIndPerfeAkt", text:""}, {id:"1PlurKonPerfeAkt", text:""}, {id:"1PlurIndPerfePas", text:""}, {id:"1PlurKonPerfePas", text:""}],
	[{type:0}, {type:0},    {id:"row2PersPlurPerfe", text:"2.", type:2}, {id:"2PlurIndPerfeAkt", text:""}, {id:"2PlurKonPerfeAkt", text:""}, {id:"2PlurIndPerfePas", text:""}, {id:"2PlurKonPerfePas", text:""}],
	[{type:0}, {type:0},    {id:"row3PersPlurPerfe", text:"3.", type:2}, {id:"3PlurIndPerfeAkt", text:""}, {id:"3PlurKonPerfeAkt", text:""}, {id:"3PlurIndPerfePas", text:""}, {id:"3PlurKonPerfePas", text:""}],
	[{id:"Plusquamperfekt", text:sTempus("Plusquamperfekt"), short:sTempus("Plusquamperf."), rot:1, type:2, rowspan: 6},     {id:"rowPlusqSing", text:"Singular", short:"Sing.", rowspan:3, type:2},     {id:"row1PersSingPlusq", text:"1.", type:2}, {id:"1SingIndPlusqAkt", text:""}, {id:"1SingKonPlusqAkt", text:""}, {id:"1SingIndPlusqPas", text:""}, {id:"1SingKonPlusqPas", text:""}],
	[{type:0}, {type:0},    {id:"row2PersSingPlusq", text:"2.", type:2}, {id:"2SingIndPlusqAkt", text:""}, {id:"2SingKonPlusqAkt", text:""}, {id:"2SingIndPlusqPas", text:""}, {id:"2SingKonPlusqPas", text:""}],
	[{type:0}, {type:0},    {id:"row3PersSingPlusq", text:"3.", type:2}, {id:"3SingIndPlusqAkt", text:""}, {id:"3SingKonPlusqAkt", text:""}, {id:"3SingIndPlusqPas", text:""}, {id:"3SingKonPlusqPas", text:""}],
	[{type:0}, {id:"rowPlusqPlur", text:"Plural", short:"Plur.", rowspan:3, type:2},     {id:"row1PersPlurPlusq", text:"1.", type:2}, {id:"1PlurIndPlusqAkt", text:""}, {id:"1PlurKonPlusqAkt", text:""}, {id:"1PlurIndPlusqPas", text:""}, {id:"1PlurKonPlusqPas", text:""}],
	[{type:0}, {type:0},    {id:"row2PersPlurPlusq", text:"2.", type:2}, {id:"2PlurIndPlusqAkt", text:""}, {id:"2PlurKonPlusqAkt", text:""}, {id:"2PlurIndPlusqPas", text:""}, {id:"2PlurKonPlusqPas", text:""}],
	[{type:0}, {type:0},    {id:"row3PersPlurPlusq", text:"3.", type:2}, {id:"3PlurIndPlusqAkt", text:""}, {id:"3PlurKonPlusqAkt", text:""}, {id:"3PlurIndPlusqPas", text:""}, {id:"3PlurKonPlusqPas", text:""}],
	[{id:"Futur I", text:sTempus("Futur I"), rot:1, type:2, rowspan: 6},     {id:"rowFutu1Sing", text:"Singular", short:"Sing.", rowspan:3, type:2},     {id:"row1PersSingFutu1", text:"1.", type:2}, {id:"1SingIndFutu1Akt", text:""}, {id:"1SingKonFutu1Akt", text:""}, {id:"1SingIndFutu1Pas", text:""}, {id:"1SingKonFutu1Pas", text:""}],
	[{type:0}, {type:0},    {id:"row2PersSingFutu1", text:"2.", type:2}, {id:"2SingIndFutu1Akt", text:""}, {id:"2SingKonFutu1Akt", text:""}, {id:"2SingIndFutu1Pas", text:""}, {id:"2SingKonFutu1Pas", text:""}],
	[{type:0}, {type:0},    {id:"row3PersSingFutu1", text:"3.", type:2}, {id:"3SingIndFutu1Akt", text:""}, {id:"3SingKonFutu1Akt", text:""}, {id:"3SingIndFutu1Pas", text:""}, {id:"3SingKonFutu1Pas", text:""}],
	[{type:0}, {id:"rowFutu1Plur", text:"Plural", short:"Plur.", rowspan:3, type:2},     {id:"row1PersPlurFutu1", text:"1.", type:2}, {id:"1PlurIndFutu1Akt", text:""}, {id:"1PlurKonFutu1Akt", text:""}, {id:"1PlurIndFutu1Pas", text:""}, {id:"1PlurKonFutu1Pas", text:""}],
	[{type:0}, {type:0},    {id:"row2PersPlurFutu1", text:"2.", type:2}, {id:"2PlurIndFutu1Akt", text:""}, {id:"2PlurKonFutu1Akt", text:""}, {id:"2PlurIndFutu1Pas", text:""}, {id:"2PlurKonFutu1Pas", text:""}],
	[{type:0}, {type:0},    {id:"row3PersPlurFutu1", text:"3.", type:2}, {id:"3PlurIndFutu1Akt", text:""}, {id:"3PlurKonFutu1Akt", text:""}, {id:"3PlurIndFutu1Pas", text:""}, {id:"3PlurKonFutu1Pas", text:""}],
	[{id:"Futur II", text:sTempus("Futur II"), rot:1, type:2, rowspan: 6},     {id:"rowFutu2Sing", text:"Singular", short:"Sing.", rowspan:3, type:2},     {id:"row1PersSingFutu2", text:"1.", type:2}, {id:"1SingIndFutu2Akt", text:""}, {id:"1SingKonFutu2Akt", text:""}, {id:"1SingIndFutu2Pas", text:""}, {id:"1SingKonFutu2Pas", text:""}],
	[{type:0}, {type:0},    {id:"row2PersSingFutu2", text:"2.", type:2}, {id:"2SingIndFutu2Akt", text:""}, {id:"2SingKonFutu2Akt", text:""}, {id:"2SingIndFutu2Pas", text:""}, {id:"2SingKonFutu2Pas", text:""}],
	[{type:0}, {type:0},    {id:"row3PersSingFutu2", text:"3.", type:2}, {id:"3SingIndFutu2Akt", text:""}, {id:"3SingKonFutu2Akt", text:""}, {id:"3SingIndFutu2Pas", text:""}, {id:"3SingKonFutu2Pas", text:""}],
	[{type:0}, {id:"rowFutu2Plur", text:"Plural", short:"Plur.", rowspan:3, type:2},     {id:"row1PersPlurFutu2", text:"1.", type:2}, {id:"1PlurIndFutu2Akt", text:""}, {id:"1PlurKonFutu2Akt", text:""}, {id:"1PlurIndFutu2Pas", text:""}, {id:"1PlurKonFutu2Pas", text:""}],
	[{type:0}, {type:0},    {id:"row2PersPlurFutu2", text:"2.", type:2}, {id:"2PlurIndFutu2Akt", text:""}, {id:"2PlurKonFutu2Akt", text:""}, {id:"2PlurIndFutu2Pas", text:""}, {id:"2PlurKonFutu2Pas", text:""}],
	[{type:0}, {type:0},    {id:"row3PersPlurFutu2", text:"3.", type:2}, {id:"3PlurIndFutu2Akt", text:""}, {id:"3PlurKonFutu2Akt", text:""}, {id:"3PlurIndFutu2Pas", text:""}, {id:"3PlurKonFutu2Pas", text:""}],
  ];
  
   var Imperativtab = [
	[{id:"empty", text:"", type:2},   {id:"singular", text:"Singular", type:2},   {id:"plural", text:"Plural", type:2}],
	[{id:"rowImperativI", text:"Imperativ I", short:"Imp. I", type:2},     {id:"2SingImpImpr1Akt", text:""},     {id:"2PlurImpImpr1Akt", text:""}],
	[{id:"rowImperativII2", text:"Imperativ II, 2. Pers.", short:"Imp. II, 2. Pers.", type:2},     {id:"2SingImpImpr2Akt", text:""},     {id:"2PlurImpImpr2Akt", text:""}],
	[{id:"rowImperativII3", text:"Imperativ II, 3. Pers.", short:"Imp. II, 3. Pers.", type:2},       {id:"3SingImpImpr2Akt", text:""},       {id:"3PlurImpImpr2Akt", text:""}],
  ];
   var Infinitivtab = [
	[{id:"tempus", text:"Tempus", type:2},   {id:"aktiv", text:"Aktiv", type:2},   {id:"passiv", text:"Passiv", type:2}],
	[{id:"praesens", text:"Präsens", type:2},{id:"PraesensAkt", text:""},     {id:"PraesensPas", text:""}],
	[{id:"perfekt", text:"Perfekt", type:2}, {id:"PerfektAkt", text:""},     {id:"PerfektPas", text:""}],
	[{id:"futur", text:"Futur", type:2},     {id:"FuturAkt", text:""},       {id:"FuturPas", text:""}],
  ];
   var Partiziptab = [
	[{id:"empty1", text:"", colspan:1, type:2},
   {id:"empty2", text:"", colspan:1, type:2},
   {id:"empty3", text:"", colspan:1, type:2},{id:"colM", text:sGenus("maskulinum"), genus:"M", type:2}, {id:"colF", text:sGenus("femininum"), genus:"F", type:2}, {id:"colN", genus:"N", text:sGenus("neutrum"), type:2}],
	[{id:"rowPPA", text:sPartizip("Partizip Präsens Aktiv"), rowspan:10, type:2, rot:1}, {id:"rowPPASing", text:"Singular", rowspan:5, type:2, rot:1},	
						{id:"rowPPASingNom", text:"Nom.", type:2},	{id:"PPASingNomM", genus:"M", text:""},   {id:"PPASingNomF", genus:"F", text:""}, {id:"PPASingNomN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPPASingGen", text:"Gen.", type:2},	{id:"PPASingGenM", genus:"M", text:""},   {id:"PPASingGenF", genus:"F", text:""}, {id:"PPASingGenN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPPASingDat", text:"Dat.", type:2},	{id:"PPASingDatM", genus:"M", text:""},   {id:"PPASingDatF", genus:"F", text:""}, {id:"PPASingDatN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPPASingAkk", text:"Akk.", type:2},	{id:"PPASingAkkM", genus:"M", text:""},   {id:"PPASingAkkF", genus:"F", text:""}, {id:"PPASingAkkN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPPASingAbl", text:"Abl.", type:2},	{id:"PPASingAblM", genus:"M", text:""},   {id:"PPASingAblF", genus:"F", text:""}, {id:"PPASingAblN", genus:"N", text:""}],
	[{type:0},{id:"rowPPAPlur", text:"Plural", rowspan:5, type:2, rot:1},	
						{id:"rowPPAPlurNom", text:"Nom.", type:2},	{id:"PPAPlurNomM", genus:"M", text:""},   {id:"PPAPlurNomF", genus:"F", text:""}, {id:"PPAPlurNomN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPPAPlurGen", text:"Gen.", type:2},	{id:"PPAPlurGenM", genus:"M", text:""},   {id:"PPAPlurGenF", genus:"F", text:""}, {id:"PPAPlurGenN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPPAPlurDat", text:"Dat.", type:2},	{id:"PPAPlurDatM", genus:"M", text:""},   {id:"PPAPlurDatF", genus:"F", text:""}, {id:"PPAPlurDatN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPPAPlurAkk", text:"Akk.", type:2},	{id:"PPAPlurAkkM", genus:"M", text:""},   {id:"PPAPlurAkkF", genus:"F", text:""}, {id:"PPAPlurAkkN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPPAPlurAbl", text:"Abl.", type:2},	{id:"PPAPlurAblM", genus:"M", text:""},   {id:"PPAPlurAblF", genus:"F", text:""}, {id:"PPAPlurAblN", genus:"N", text:""}],
	[{id:"rowPPP", text:sPartizip("Partizip Perfekt Passiv"), rowspan:10, type:2, rot:1}, {id:"rowPPPSing", text:"Singular", rowspan:5, type:2, rot:1},	
						{id:"rowPPPSingNom", text:"Nom.", type:2},	{id:"PPPSingNomM", genus:"M", text:""},   {id:"PPPSingNomF", genus:"F", text:""}, {id:"PPPSingNomN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPPPSingGen", text:"Gen.", type:2},	{id:"PPPSingGenM", genus:"M", text:""},   {id:"PPPSingGenF", genus:"F", text:""}, {id:"PPPSingGenN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPPPSingDat", text:"Dat.", type:2},	{id:"PPPSingDatM", genus:"M", text:""},   {id:"PPPSingDatF", genus:"F", text:""}, {id:"PPPSingDatN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPPPSingAkk", text:"Akk.", type:2},	{id:"PPPSingAkkM", genus:"M", text:""},   {id:"PPPSingAkkF", genus:"F", text:""}, {id:"PPPSingAkkN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPPPSingAbl", text:"Abl.", type:2},	{id:"PPPSingAblM", genus:"M", text:""},   {id:"PPPSingAblF", genus:"F", text:""}, {id:"PPPSingAblN", genus:"N", text:""}],
	[{type:0},{id:"rowPPPPlur", text:"Plural", rowspan:5, type:2, rot:1},	
						{id:"rowPPPPlurNom", text:"Nom.", type:2},	{id:"PPPPlurNomM", genus:"M", text:""},   {id:"PPPPlurNomF", genus:"F", text:""}, {id:"PPPPlurNomN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPPPPlurGen", text:"Gen.", type:2},	{id:"PPPPlurGenM", genus:"M", text:""},   {id:"PPPPlurGenF", genus:"F", text:""}, {id:"PPPPlurGenN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPPPPlurDat", text:"Dat.", type:2},	{id:"PPPPlurDatM", genus:"M", text:""},   {id:"PPPPlurDatF", genus:"F", text:""}, {id:"PPPPlurDatN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPPPPlurAkk", text:"Akk.", type:2},	{id:"PPPPlurAkkM", genus:"M", text:""},   {id:"PPPPlurAkkF", genus:"F", text:""}, {id:"PPPPlurAkkN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPPPPlurAbl", text:"Abl.", type:2},	{id:"PPPPlurAblM", genus:"M", text:""},   {id:"PPPPlurAblF", genus:"F", text:""}, {id:"PPPPlurAblN", genus:"N", text:""}],
	[{id:"rowPFA", text:sPartizip("Partizip Futur Aktiv"), rowspan:10, type:2, rot:1}, {id:"rowPFASing", text:"Singular", rowspan:5, type:2, rot:1},	
						{id:"rowPFASingNom", text:"Nom.", type:2},	{id:"PFASingNomM", genus:"M", text:""},   {id:"PFASingNomF", genus:"F", text:""}, {id:"PFASingNomN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPFASingGen", text:"Gen.", type:2},	{id:"PFASingGenM", genus:"M", text:""},   {id:"PFASingGenF", genus:"F", text:""}, {id:"PFASingGenN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPFASingDat", text:"Dat.", type:2},	{id:"PFASingDatM", genus:"M", text:""},   {id:"PFASingDatF", genus:"F", text:""}, {id:"PFASingDatN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPFASingAkk", text:"Akk.", type:2},	{id:"PFASingAkkM", genus:"M", text:""},   {id:"PFASingAkkF", genus:"F", text:""}, {id:"PFASingAkkN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPFASingAbl", text:"Abl.", type:2},	{id:"PFASingAblM", genus:"M", text:""},   {id:"PFASingAblF", genus:"F", text:""}, {id:"PFASingAblN", genus:"N", text:""}],
	[{type:0},{id:"rowPFAPlur", text:"Plural", rowspan:5, type:2, rot:1},	
						{id:"rowPFAPlurNom", text:"Nom.", type:2},	{id:"PFAPlurNomM", genus:"M", text:""},   {id:"PFAPlurNomF", genus:"F", text:""}, {id:"PFAPlurNomN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPFAPlurGen", text:"Gen.", type:2},	{id:"PFAPlurGenM", genus:"M", text:""},   {id:"PFAPlurGenF", genus:"F", text:""}, {id:"PFAPlurGenN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPFAPlurDat", text:"Dat.", type:2},	{id:"PFAPlurDatM", genus:"M", text:""},   {id:"PFAPlurDatF", genus:"F", text:""}, {id:"PFAPlurDatN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPFAPlurAkk", text:"Akk.", type:2},	{id:"PFAPlurAkkM", genus:"M", text:""},   {id:"PFAPlurAkkF", genus:"F", text:""}, {id:"PFAPlurAkkN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowPFAPlurAbl", text:"Abl.", type:2},	{id:"PFAPlurAblM", genus:"M", text:""},   {id:"PFAPlurAblF", genus:"F", text:""}, {id:"PFAPlurAblN", genus:"N", text:""}],
	[{id:"rowGer", text:sPartizip("Gerundivum"), rowspan:10, type:2, rot:1}, {id:"rowGerSing", text:"Singular", rowspan:5, type:2, rot:1},	
						{id:"rowGerSingNom", text:"Nom.", type:2},	{id:"GerSingNomM", genus:"M", text:""},   {id:"GerSingNomF", genus:"F", text:""}, {id:"GerSingNomN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowGerSingGen", text:"Gen.", type:2},	{id:"GerSingGenM", genus:"M", text:""},   {id:"GerSingGenF", genus:"F", text:""}, {id:"GerSingGenN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowGerSingDat", text:"Dat.", type:2},	{id:"GerSingDatM", genus:"M", text:""},   {id:"GerSingDatF", genus:"F", text:""}, {id:"GerSingDatN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowGerSingAkk", text:"Akk.", type:2},	{id:"GerSingAkkM", genus:"M", text:""},   {id:"GerSingAkkF", genus:"F", text:""}, {id:"GerSingAkkN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowGerSingAbl", text:"Abl.", type:2},	{id:"GerSingAblM", genus:"M", text:""},   {id:"GerSingAblF", genus:"F", text:""}, {id:"GerSingAblN", genus:"N", text:""}],
	[{type:0},{id:"rowGerPlur", text:"Plural", rowspan:5, type:2, rot:1},	
						{id:"rowGerPlurNom", text:"Nom.", type:2},	{id:"GerPlurNomM", genus:"M", text:""},   {id:"GerPlurNomF", genus:"F", text:""}, {id:"GerPlurNomN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowGerPlurGen", text:"Gen.", type:2},	{id:"GerPlurGenM", genus:"M", text:""},   {id:"GerPlurGenF", genus:"F", text:""}, {id:"GerPlurGenN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowGerPlurDat", text:"Dat.", type:2},	{id:"GerPlurDatM", genus:"M", text:""},   {id:"GerPlurDatF", genus:"F", text:""}, {id:"GerPlurDatN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowGerPlurAkk", text:"Akk.", type:2},	{id:"GerPlurAkkM", genus:"M", text:""},   {id:"GerPlurAkkF", genus:"F", text:""}, {id:"GerPlurAkkN", genus:"N", text:""}],
	[{type:0},{type:0},	{id:"rowGerPlurAbl", text:"Abl.", type:2},	{id:"GerPlurAblM", genus:"M", text:""},   {id:"GerPlurAblF", genus:"F", text:""}, {id:"GerPlurAblN", genus:"N", text:""}],
  ];
 

   var DeklinationstabAdjektiv = [
	[{id:"empty1", colspan:1, text:"", type:2}, {id:"empty2", colspan:1, text:"", type:2},{id:"colM", text:sGenus("maskulinum"), type:2, genus:"M"}, {id:"colF", text:sGenus("femininum"), type:2, genus:"F"}, {id:"colN", text:sGenus("neutrum"), type:2, genus:"N"}],
	[{id:"rowSing", text:"Singular", rowspan:5, type:2, rot:1},	{id:"rowSingNom", text:"Nom.", type:2},	{id:"SingNomM", text:"", genus:"M"},   {id:"SingNomF", text:"", genus:"F"}, {id:"SingNomN", text:"", genus:"N"}],
	[{type:0},	{id:"rowSingGen", text:"Gen.", type:2},	{id:"SingGenM", genus:"M", text:""},   {id:"SingGenF", genus:"F", text:""}, {id:"SingGenN", genus:"N", text:""}],
	[{type:0},	{id:"rowSingDat", text:"Dat.", type:2},	{id:"SingDatM", genus:"M", text:""},   {id:"SingDatF", genus:"F", text:""}, {id:"SingDatN", genus:"N", text:""}],
	[{type:0},	{id:"rowSingAkk", text:"Akk.", type:2},	{id:"SingAkkM", genus:"M", text:""},   {id:"SingAkkF", genus:"F", text:""}, {id:"SingAkkN", genus:"N", text:""}],
	[{type:0},	{id:"rowSingAbl", text:"Abl.", type:2},	{id:"SingAblM", genus:"M", text:""},   {id:"SingAblF", genus:"F", text:""}, {id:"SingAblN", genus:"N", text:""}],
	[{id:"rowPlur", text:"Plural", rowspan:5, type:2, rot:1},	{id:"rowPlurNom", text:"Nom.", type:2},	{id:"PlurNomM", genus:"M", text:""},   {id:"PlurNomF", genus:"F", text:""}, {id:"PlurNomN", genus:"N", text:""}],
	[{type:0},	{id:"rowPlurGen", text:"Gen.", type:2},	{id:"PlurGenM", genus:"M", text:""},   {id:"PlurGenF", genus:"F", text:""}, {id:"PlurGenN", genus:"N", text:""}],
	[{type:0},	{id:"rowPlurDat", text:"Dat.", type:2},	{id:"PlurDatM", genus:"M", text:""},   {id:"PlurDatF", genus:"F", text:""}, {id:"PlurDatN", genus:"N", text:""}],
	[{type:0},	{id:"rowPlurAkk", text:"Akk.", type:2},	{id:"PlurAkkM", genus:"M", text:""},   {id:"PlurAkkF", genus:"F", text:""}, {id:"PlurAkkN", genus:"N", text:""}],
	[{type:0},	{id:"rowPlurAbl", text:"Abl.", type:2},	{id:"PlurAblM", genus:"M", text:""},   {id:"PlurAblF", genus:"F", text:""}, {id:"PlurAblN", genus:"N", text:""}],
  ];  
 
   var DeklinationstabPronomen = [
	[{id:"empty", text:"", type:2},{id:"colKasus", text:"Kasus", type:2},{id:"colM", text:sGenus("maskulinum"), genus:"M", type:2}, {id:"colF", text:sGenus("femininum"), genus:"F", type:2}, {id:"colN", text:sGenus("neutrum"), genus:"N", type:2}],
	[{id:"rowSing", text:"Singular", rowspan:5, type:2},	{id:"rowSingNom", text:"Nom.", type:2},	{id:"SingNomM", genus:"M", text:""},   {id:"SingNomF", genus:"F", text:""}, {id:"SingNomN", genus:"N", text:""}],
	[{type:0},	{id:"rowSingGen", text:"Gen.", type:2},	{id:"SingGenM", genus:"M", text:""},   {id:"SingGenF", genus:"F", text:""}, {id:"SingGenN", genus:"N", text:""}],
	[{type:0},	{id:"rowSingDat", text:"Dat.", type:2},	{id:"SingDatM", genus:"M", text:""},   {id:"SingDatF", genus:"F", text:""}, {id:"SingDatN", genus:"N", text:""}],
	[{type:0},	{id:"rowSingAkk", text:"Akk.", type:2},	{id:"SingAkkM", genus:"M", text:""},   {id:"SingAkkF", genus:"F", text:""}, {id:"SingAkkN", genus:"N", text:""}],
	[{type:0},	{id:"rowSingAbl", text:"Abl.", type:2},	{id:"SingAblM", genus:"M", text:""},   {id:"SingAblF", genus:"F", text:""}, {id:"SingAblN", genus:"N", text:""}],
	[{id:"rowPlur", text:"Plural", rowspan:5, type:2},	{id:"rowPlurNom", text:"Nom.", type:2},	{id:"PlurNomM", genus:"M", text:""},   {id:"PlurNomF", genus:"F", text:""}, {id:"PlurNomN", genus:"N", text:""}],
	[{type:0},	{id:"rowPlurGen", text:"Gen.", type:2},	{id:"PlurGenM", genus:"M", text:""},   {id:"PlurGenF", genus:"F", text:""}, {id:"PlurGenN", genus:"N", text:""}],
	[{type:0},	{id:"rowPlurDat", text:"Dat.", type:2},	{id:"PlurDatM", genus:"M", text:""},   {id:"PlurDatF", genus:"F", text:""}, {id:"PlurDatN", genus:"N", text:""}],
	[{type:0},	{id:"rowPlurAkk", text:"Akk.", type:2},	{id:"PlurAkkM", genus:"M", text:""},   {id:"PlurAkkF", genus:"F", text:""}, {id:"PlurAkkN", genus:"N", text:""}],
	[{type:0},	{id:"rowPlurAbl", text:"Abl.", type:2},	{id:"PlurAblM", genus:"M", text:""},   {id:"PlurAblF", genus:"F", text:""}, {id:"PlurAblN", genus:"N", text:""}],
  ]; 
   var DeklinationstabReflPersPronomen = [
	[{id:"empty", text:"", type:2},{id:"colKasus", text:"Kasus", type:2},{id:"col1P", text:sGenus("1. Person"), person:"1", type:2}, {id:"col2P", text:sGenus("2. Person"), person:"2", type:2}, {id:"col3P", text:sGenus("3. Person"), person:"3", type:2}],
	[{id:"rowSing", text:"Singular", rowspan:5, type:2},	{id:"rowSingNom", text:"Nom.", type:2},	{id:"SingNom1", person:"1", text:""},   {id:"SingNom2", person:"2", text:""}, {id:"SingNom3", person:"3", text:""}],
	[{type:0},	{id:"rowSingGen", text:"Gen.", type:2},	{id:"SingGen1", person:"1", text:""},   {id:"SingGen2", person:"2", text:""}, {id:"SingGen3", person:"3", text:""}],
	[{type:0},	{id:"rowSingDat", text:"Dat.", type:2},	{id:"SingDat1", person:"1", text:""},   {id:"SingDat2", person:"2", text:""}, {id:"SingDat3", person:"3", text:""}],
	[{type:0},	{id:"rowSingAkk", text:"Akk.", type:2},	{id:"SingAkk1", person:"1", text:""},   {id:"SingAkk2", person:"2", text:""}, {id:"SingAkk3", person:"3", text:""}],
	[{type:0},	{id:"rowSingAbl", text:"Abl.", type:2},	{id:"SingAbl1", person:"1", text:""},   {id:"SingAbl2", person:"2", text:""}, {id:"SingAbl3", person:"3", text:""}],
	[{id:"rowPlur", text:"Plural", rowspan:5, type:2},	{id:"rowPlurNom", text:"Nom.", type:2},	{id:"PlurNom1", person:"1", text:""},   {id:"PlurNom2", person:"2", text:""}, {id:"PlurNom3", person:"3", text:""}],
	[{type:0},	{id:"rowPlurGen", text:"Gen.", type:2},	{id:"PlurGen1", person:"1", text:""},   {id:"PlurGen2", person:"2", text:""}, {id:"PlurGen3", person:"3", text:""}],
	[{type:0},	{id:"rowPlurDat", text:"Dat.", type:2},	{id:"PlurDat1", person:"1", text:""},   {id:"PlurDat2", person:"2", text:""}, {id:"PlurDat3", person:"3", text:""}],
	[{type:0},	{id:"rowPlurAkk", text:"Akk.", type:2},	{id:"PlurAkk1", person:"1", text:""},   {id:"PlurAkk2", person:"2", text:""}, {id:"PlurAkk3", person:"3", text:""}],
	[{type:0},	{id:"rowPlurAbl", text:"Abl.", type:2},	{id:"PlurAbl1", person:"1", text:""},   {id:"PlurAbl2", person:"2", text:""}, {id:"PlurAbl3", person:"3", text:""}],
  ];   

  	function tagEmpty(s) {
		return "<empty>"+s+"</empty>";
	}
  	function tagStamm(s) {
		return "<stamm>"+s+"</stamm>";
	}
		
	function tagSuffix(s) {
		return "<suffix>"+s+"</suffix>";
	}			
	function tagInfix(s) {
		return "<infix>"+s+"</infix>";
	}
		
	function tagLatin(s) {
		return "<latin>"+s+"</latin>";
	}
		
	function tagDeutsch(s) {
		return "<de>"+s+"</de>";
	}
	function tagArtikel(s) {
		return "<artikel>"+s+"</artikel>";
	}
	function mitKasus(s) {
		if (s==null) return ""
		return "<mitKasus>"+s+"</mitKasus>";
	}
	function tagHint(s) {
		if (s==null) return ""
		return "<hint>"+s+"</hint>";
	}
	function tagDeHinweis(s) {
		return "<hinweis>"+s+"</hinweis>";
	}
	function tagWArt(s) {
		return "<woart>"+s+"</woart>";
	}	
	function tagAlt(s) {
		return "<alternative>"+s+"</alternative>";
	}	
	
 // konjugation esse
  var esseIndikativPraesensAktiv = [
  {Singular:[{1: "su"+tagSuffix("m"),    2: "e"+tagSuffix("s"),    3: "es"+tagSuffix("t")}], Plural:[{1: "su"+tagSuffix("mus"),    2: "es"+tagSuffix("tis"),    3: "su"+tagSuffix("nt")}]} ];	
 var esseKonjunktivPraesensAktiv = [
  {Singular:[{1: "s"+tagInfix("i")+tagSuffix("m"),    2: "s"+tagInfix("ī")+tagSuffix("s"),    3: "s"+tagInfix("i")+tagSuffix("t")}], Plural:[{1: "s"+tagInfix("ī")+tagSuffix("mus"),    2: "s"+tagInfix("ī")+tagSuffix("tis"),    3: "s"+tagInfix("i")+tagSuffix("nt")}]} ];	
 var esseIndikativPraesensPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];	
 var esseKonjunktivPraesensPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];
 var esseIndikativImperfektAktiv = [
  {Singular:[{1: "er"+tagInfix("a")+tagSuffix("m"),    2: "er"+tagInfix("ā")+tagSuffix("s"),    3: "er"+tagInfix("a")+tagSuffix("t")}], Plural:[{1: "er"+tagInfix("ā")+tagSuffix("mus"),    2: "er"+tagInfix("ā")+tagSuffix("tis"),    3: "er"+tagInfix("a")+tagSuffix("nt")}]} ];	
 var esseKonjunktivImperfektAktiv = [
  {Singular:[{1: "ess"+tagInfix("e")+tagSuffix("m"),    2: "ess"+tagInfix("ē")+tagSuffix("s"),    3: "ess"+tagInfix("e")+tagSuffix("t")}], Plural:[{1:  "ess"+tagInfix("ē")+tagSuffix("mus"),    2:  "ess"+tagInfix("ē")+tagSuffix("tis"),    3: "ess"+tagInfix("e")+tagSuffix("nt")}]} ];	
 var esseIndikativImperfektPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];	
 var esseKonjunktivImperfektPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];
 var esseIndikativPerfektAktiv = [
  {Singular:[{1: "fu"+tagSuffix("ī"),    2: "fu"+tagSuffix("istī"),    3: "fu"+tagSuffix("it")}], Plural:[{1: "fu"+tagSuffix("imus"),    2: "fu"+tagSuffix("istis"),    3: "fu"+tagSuffix("ērunt")}]} ];	
 var esseKonjunktivPerfektAktiv = [
  {Singular:[{1: "fu"+tagSuffix("erim"),    2: "fu"+tagSuffix("eris"),    3: "fu"+tagSuffix("erit")}], Plural:[{1:  "fu"+tagSuffix("érimus"),    2:  "fu"+tagSuffix("éritis"),    3: "fu"+tagSuffix("erint")}]}  ];	
 var esseIndikativPerfektPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];	
 var esseKonjunktivPerfektPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];
 var esseIndikativPlusquamperfektAktiv = [
  {Singular:[{1: "fu"+tagSuffix("eram"),    2: "fu"+tagSuffix("erās"),    3: "fu"+tagSuffix("erat")}], Plural:[{1: "fu"+tagSuffix("erāmus"),    2: "fu"+tagSuffix("erātis"),    3: "fu"+tagSuffix("erant")}]} ];	
 var esseKonjunktivPlusquamperfektAktiv = [
  {Singular:[{1: "fu"+tagSuffix("issem"),    2: "fu"+tagSuffix("issēs"),    3: "fu"+tagSuffix("isset")}], Plural:[{1:  "fu"+tagSuffix("issēmus"),    2:  "fu"+tagSuffix("issētis"),    3: "fu"+tagSuffix("issent")}]} ];	
 var esseIndikativPlusquamperfektPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];	
 var esseKonjunktivPlusquamperfektPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];
 var esseIndikativFuturIAktiv = [
  {Singular:[{1: "er"+tagSuffix("ō"),    2: "er"+tagInfix("i")+tagSuffix("s"),    3: "er"+tagInfix("i")+tagSuffix("t")}], Plural:[{1: "er"+tagInfix("i")+tagSuffix("mus"),    2: "er"+tagInfix("i")+tagSuffix("tis"),    3: "er"+tagInfix("u")+tagSuffix("nt")}]} ];	
 var esseKonjunktivFuturIAktiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];	
 var esseIndikativFuturIPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];	
 var esseKonjunktivFuturIPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];
  var esseIndikativFuturIIAktiv = [
  {Singular:[{1: "fu"+tagInfix("er")+tagSuffix("ō"),    2: "fu"+tagInfix("eri")+tagSuffix("s"),    3: "fu"+tagInfix("eri")+tagSuffix("t")}], Plural:[{1: "fu"+tagInfix("eri")+tagSuffix("mus"),    2: "fu"+tagInfix("eri")+tagSuffix("tis"),    3: "fu"+tagInfix("eru")+tagSuffix("nt")}]} ];	
 var esseKonjunktivFuturIIAktiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];	
 var esseIndikativFuturIIPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];	
 var esseKonjunktivFuturIIPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];
 var esseImperativI = [ {Singular:[{2: "es"}], Plural:[{2: "es"+tagSuffix("te")}] }];
 var esseImperativII = [ {Singular:[{2: "es"+tagSuffix("tō"), 3: "es"+tagSuffix("tō")}], Plural:[{2: "es"+tagSuffix("tōte"), 3: "su"+tagSuffix("ntō")}] }];
 var esseKonjugation = [{Indikativ:[{Praesens:[{Aktiv:esseIndikativPraesensAktiv, Passiv:esseIndikativPraesensPassiv}],
								 Imperfekt:[{Aktiv:esseIndikativImperfektAktiv, Passiv:esseIndikativImperfektPassiv}],
								 Perfekt:[{Aktiv:esseIndikativPerfektAktiv, Passiv:esseIndikativPerfektPassiv}],
								 Plusquamperfekt:[{Aktiv:esseIndikativPlusquamperfektAktiv, Passiv:esseIndikativPlusquamperfektPassiv}],
								 Futu1:[{Aktiv:esseIndikativFuturIAktiv, Passiv:esseIndikativFuturIPassiv}],
								 Futu2:[{Aktiv:esseIndikativFuturIIAktiv, Passiv:esseIndikativFuturIIPassiv}]}
								], 
					  Konjunktiv:[{Praesens:[{Aktiv:esseKonjunktivPraesensAktiv, Passiv:esseKonjunktivPraesensPassiv}],
								  Imperfekt:[{Aktiv:esseKonjunktivImperfektAktiv, Passiv:esseKonjunktivImperfektPassiv}],
								  Perfekt:[{Aktiv:esseKonjunktivPerfektAktiv, Passiv:esseKonjunktivPerfektPassiv}],
								  Plusquamperfekt:[{Aktiv:esseKonjunktivPlusquamperfektAktiv, Passiv:esseKonjunktivPlusquamperfektPassiv}],
								 Futu1:[{Aktiv:esseKonjunktivFuturIAktiv, Passiv:esseKonjunktivFuturIPassiv}],
								 Futu2:[{Aktiv:esseKonjunktivFuturIIAktiv, Passiv:esseKonjunktivFuturIIPassiv}]}  ],
					  Imperativ:[{Impr1:[{Aktiv:esseImperativI}],
								  Impr2:[{Aktiv:esseImperativII}],
								 }  ],								 				 
								 }];
 // konjugation posse
  var posseIndikativPraesensAktiv = [
  {Singular:[{1: "pos"+tagInfix("su")+tagSuffix("m"),    2: "pot"+tagInfix("e")+tagSuffix("s"),    3: "pot"+tagInfix("es")+tagSuffix("t")}], Plural:[{1: "pos"+tagInfix("su")+tagSuffix("mus"),    2: "pot"+tagInfix("es")+tagSuffix("tis"),    3: "pos"+tagInfix("su")+tagSuffix("nt")}]} ];	
 var posseKonjunktivPraesensAktiv = [
  {Singular:[{1: "pos"+tagInfix("si")+tagSuffix("m"),    2: "pos"+tagInfix("sī")+tagSuffix("s"),    3: "pos"+tagInfix("si")+tagSuffix("t")}], Plural:[{1: "pos"+tagInfix("sī")+tagSuffix("mus"),    2: "pos"+tagInfix("sī")+tagSuffix("tis"),    3: "pos"+tagInfix("si")+tagSuffix("nt")}]} ];	
 var posseIndikativPraesensPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];	
 var posseKonjunktivPraesensPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];
 var posseIndikativImperfektAktiv = [
  {Singular:[{1: "pot"+tagInfix("era")+tagSuffix("m"),    2: "pot"+tagInfix("erā")+tagSuffix("s"),    3: "pot"+tagInfix("era")+tagSuffix("t")}], Plural:[{1: "pot"+tagInfix("erā")+tagSuffix("mus"),    2: "pot"+tagInfix("erā")+tagSuffix("tis"),    3: "pot"+tagInfix("era")+tagSuffix("nt")}]} ];	
 var posseKonjunktivImperfektAktiv = [
  {Singular:[{1: "pos"+tagInfix("se")+tagSuffix("m"),    2: "pos"+tagInfix("sē")+tagSuffix("s"),    3: "pos"+tagInfix("se")+tagSuffix("t")}], Plural:[{1:  "pos"+tagInfix("sē")+tagSuffix("mus"),    2:  "pos"+tagInfix("sē")+tagSuffix("tis"),    3: "pos"+tagInfix("se")+tagSuffix("nt")}]} ];	
 var posseIndikativImperfektPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];	
 var posseKonjunktivImperfektPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];
 var posseIndikativPerfektAktiv = [
  {Singular:[{1: "potu"+tagSuffix("ī"),    2: "potu"+tagSuffix("istī"),    3: "potu"+tagSuffix("it")}], Plural:[{1: "potu"+tagSuffix("imus"),    2: "potu"+tagSuffix("istis"),    3: "potu"+tagSuffix("ērunt")}]} ];	
 var posseKonjunktivPerfektAktiv = [
  {Singular:[{1: "potu"+tagSuffix("erim"),    2: "potu"+tagSuffix("eris"),    3: "potu"+tagSuffix("erit")}], Plural:[{1:  "potu"+tagSuffix("érimus"),    2:  "potu"+tagSuffix("éritis"),    3: "potu"+tagSuffix("erint")}]}  ];	
 var posseIndikativPerfektPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];	
 var posseKonjunktivPerfektPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];
 var posseIndikativPlusquamperfektAktiv = [
  {Singular:[{1: "potu"+tagSuffix("eram"),    2: "potu"+tagSuffix("erās"),    3: "potu"+tagSuffix("erat")}], Plural:[{1: "potu"+tagSuffix("erāmus"),    2: "potu"+tagSuffix("erātis"),    3: "potu"+tagSuffix("erant")}]} ];	
 var posseKonjunktivPlusquamperfektAktiv = [
  {Singular:[{1: "potu"+tagSuffix("issem"),    2: "potu"+tagSuffix("issēs"),    3: "potu"+tagSuffix("isset")}], Plural:[{1:  "potu"+tagSuffix("issēmus"),    2:  "potu"+tagSuffix("issētis"),    3: "potu"+tagSuffix("issent")}]} ];	
 var posseIndikativPlusquamperfektPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];	
 var posseKonjunktivPlusquamperfektPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];
 var posseIndikativFuturIAktiv = [
  {Singular:[{1: "pot"+tagInfix("er")+tagSuffix("ō"),    2: "pot"+tagInfix("eri")+tagSuffix("s"),    3: "pot"+tagInfix("eri")+tagSuffix("t")}], Plural:[{1: "pot"+tagInfix("eri")+tagSuffix("mus"),    2: "pot"+tagInfix("eri")+tagSuffix("tis"),    3: "pot"+tagInfix("eru")+tagSuffix("nt")}]} ];	
 var posseKonjunktivFuturIAktiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];	
 var posseIndikativFuturIPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];	
 var posseKonjunktivFuturIPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];
  var posseIndikativFuturIIAktiv = [
  {Singular:[{1: "potu"+tagInfix("er")+tagSuffix("ō"),    2: "potu"+tagInfix("eri")+tagSuffix("s"),    3: "potu"+tagInfix("eri")+tagSuffix("t")}], Plural:[{1: "potu"+tagInfix("eri")+tagSuffix("mus"),    2: "potu"+tagInfix("eri")+tagSuffix("tis"),    3: "potu"+tagInfix("eri")+tagSuffix("nt")}]} ];	
 var posseKonjunktivFuturIIAktiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];	
 var posseIndikativFuturIIPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];	
 var posseKonjunktivFuturIIPassiv = [ {Singular:[{1: "-",    2: "-",    3: "-"}], Plural:[{1: "-",    2: "-",    3: "-"}] } ];
 var posseImperativI = [ {Singular:[{2: "-"}], Plural:[{2: "-"}] }];
 // var posseImperativI = [ {Singular:[{2: "potesto"}], Plural:[{2: "-"}] }];
 //http://www.latein-imperium.de/include.php?path=content&type=&contentid=24 gibt imperativ an
 var posseImperativII = [ {Singular:[{2: "-", 3: "-"}], Plural:[{2: "-", 3: "-"}] }];
 var posseKonjugation = [{Indikativ:[{Praesens:[{Aktiv:posseIndikativPraesensAktiv, Passiv:posseIndikativPraesensPassiv}],
								 Imperfekt:[{Aktiv:posseIndikativImperfektAktiv, Passiv:posseIndikativImperfektPassiv}],
								 Perfekt:[{Aktiv:posseIndikativPerfektAktiv, Passiv:posseIndikativPerfektPassiv}],
								 Plusquamperfekt:[{Aktiv:posseIndikativPlusquamperfektAktiv, Passiv:posseIndikativPlusquamperfektPassiv}],
								 Futu1:[{Aktiv:posseIndikativFuturIAktiv, Passiv:posseIndikativFuturIPassiv}],
								 Futu2:[{Aktiv:posseIndikativFuturIIAktiv, Passiv:posseIndikativFuturIIPassiv}]}
								], 
					  Konjunktiv:[{Praesens:[{Aktiv:posseKonjunktivPraesensAktiv, Passiv:posseKonjunktivPraesensPassiv}],
								  Imperfekt:[{Aktiv:posseKonjunktivImperfektAktiv, Passiv:posseKonjunktivImperfektPassiv}],
								  Perfekt:[{Aktiv:posseKonjunktivPerfektAktiv, Passiv:posseKonjunktivPerfektPassiv}],
								  Plusquamperfekt:[{Aktiv:posseKonjunktivPlusquamperfektAktiv, Passiv:posseKonjunktivPlusquamperfektPassiv}],
								 Futu1:[{Aktiv:posseKonjunktivFuturIAktiv, Passiv:posseKonjunktivFuturIPassiv}],
								 Futu2:[{Aktiv:posseKonjunktivFuturIIAktiv, Passiv:posseKonjunktivFuturIIPassiv}]}  ],
					  Imperativ:[{Impr1:[{Aktiv:posseImperativI}],
								  Impr2:[{Aktiv:posseImperativII}],
								 }  ],									 
								 }];

	// -are
 //praesens
  var aKonjugationIndikativPraesensAktiv = [
  {Singular:[{1: "WORTSTAMM"+tagSuffix("ō"),    2: "WORTSTAMM"+"ā"+tagSuffix("s"),    3: "WORTSTAMM"+"a"+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+"ā"+tagSuffix("mus"),    2: "WORTSTAMM"+"ā"+tagSuffix("tis"),    3: "WORTSTAMM"+"a"+tagSuffix("nt")}]}
  ];	
 var aKonjugationKonjunktivPraesensAktiv = [
  {Singular:[{1: "WORTSTAMM"+tagInfix("e")+tagSuffix("m"),    2: "WORTSTAMM"+tagInfix("ē")+tagSuffix("s"),    3: "WORTSTAMM"+tagInfix("e")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+tagInfix("ē")+tagSuffix("mus"),    2: "WORTSTAMM"+tagInfix("ē")+tagSuffix("tis"),    3: "WORTSTAMM"+tagInfix("e")+tagSuffix("nt")}]}
  ];	
 var aKonjugationIndikativPraesensPassiv = [
  {Singular:[{1: "WORTSTAMM"+tagSuffix("or"),    2: "WORTSTAMM"+"ā"+tagSuffix("ris"),    3: "WORTSTAMM"+"ā"+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+"ā"+tagSuffix("mur"),    2: "WORTSTAMM"+"ā"+tagSuffix("minī"),    3: "WORTSTAMM"+"a"+tagSuffix("ntur")}] }
  ];	
 var aKonjugationKonjunktivPraesensPassiv = [
  {Singular:[{1: "WORTSTAMM"+tagInfix("e")+tagSuffix("r"),    2: "WORTSTAMM"+tagInfix("ē")+tagSuffix("ris"),    3: "WORTSTAMM"+tagInfix("ē")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+tagInfix("ē")+tagSuffix("mur"),    2: "WORTSTAMM"+tagInfix("ē")+tagSuffix("minī"),    3: "WORTSTAMM"+tagInfix("e")+tagSuffix("ntur")}] }
  ]; 
//imperfekt
  var aKonjugationIndikativImperfektAktiv = [
  {Singular:[{1: "WORTSTAMM"+"ā"+tagInfix("ba")+tagSuffix("m"),    2: "WORTSTAMM"+"ā"+tagInfix("bā")+tagSuffix("s"),    3: "WORTSTAMM"+"ā"+tagInfix("ba")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+"ā"+tagInfix("bā")+tagSuffix("mus"),    2: "WORTSTAMM"+"ā"+tagInfix("bā")+tagSuffix("tis"),    3: "WORTSTAMM"+"ā"+tagInfix("ba")+tagSuffix("nt")}]}
  ];	
 var aKonjugationKonjunktivImperfektAktiv = [
  {Singular:[{1: "WORTSTAMM"+"ā"+tagInfix("re")+tagSuffix("m"),    2: "WORTSTAMM"+"ā"+tagInfix("rē")+tagSuffix("s"),    3: "WORTSTAMM"+"ā"+tagInfix("re")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+"ā"+tagInfix("rē")+tagSuffix("mus"),    2: "WORTSTAMM"+"ā"+tagInfix("rē")+tagSuffix("tis"),    3: "WORTSTAMM"+"ā"+tagInfix("re")+tagSuffix("nt")}]}
  ];	
 var aKonjugationIndikativImperfektPassiv = [
  {Singular:[{1: "WORTSTAMM"+"ā"+tagInfix("ba")+tagSuffix("r"),    2: "WORTSTAMM"+"ā"+"bā"+tagSuffix("ris"),    3: "WORTSTAMM"+"ā"+"bā"+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+"ā"+"bā"+tagSuffix("mur"),    2: "WORTSTAMM"+"ā"+"bā"+tagSuffix("minī"),    3: "WORTSTAMM"+"ā"+"ba"+tagSuffix("ntur")}] }
  ];	
 var aKonjugationKonjunktivImperfektPassiv = [
  {Singular:[{1: "WORTSTAMM"+"ā"+tagInfix("re")+tagSuffix("r"),    2: "WORTSTAMM"+"ā"+tagInfix("rē")+tagSuffix("ris"),    3: "WORTSTAMM"+"ā"+tagInfix("rē")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+"ā"+tagInfix("rē")+tagSuffix("mur"),    2: "WORTSTAMM"+"ā"+tagInfix("rē")+tagSuffix("minī"),    3: "WORTSTAMM"+"ā"+tagInfix("re")+tagSuffix("ntur")}] }
  ];
  //perfekt
  var aKonjugationIndikativPerfektAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("ī"),    2: "PERFEKT"+tagSuffix("istī"),    3: "PERFEKT"+tagSuffix("it")}], Plural:[{1: "PERFEKT"+tagSuffix("imus"),    2: "PERFEKT"+tagSuffix("istis"),    3: "PERFEKT"+tagSuffix("ērunt")}]}
  ];	
 var aKonjugationKonjunktivPerfektAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("erim"),    2: "PERFEKT"+tagSuffix("eris"),    3: "PERFEKT"+tagSuffix("erit")}], Plural:[{1: "PERFEKT"+tagSuffix("érimus"),    2: "PERFEKT"+tagSuffix("éritis"),    3: "PERFEKT"+tagSuffix("erint")}]}
  ];	
 var aKonjugationIndikativPerfektPassiv = [
  {Singular:[{1: "PPP"+"us sum",    2: "PPP"+"us es",    3: "PPP"+"us est"}], Plural:[{1: "PPP"+"ī sumus",    2: "PPP"+"ī estis",    3: "PPP"+"ī sunt"}] }
  ];	
 var aKonjugationKonjunktivPerfektPassiv = [
  {Singular:[{1: "PPP"+"us sim",    2: "PPP"+"us sīs",    3: "PPP"+"us sit"}], Plural:[{1: "PPP"+"ī sīmus",    2: "PPP"+"ī sītis",    3: "PPP"+"ī sint"}] }
  ];
  //plusquamperfekt
  var aKonjugationIndikativPlusquamperfektAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("eram"),    2: "PERFEKT"+tagSuffix("erās"),    3: "PERFEKT"+tagSuffix("erat")}], Plural:[{1: "PERFEKT"+tagSuffix("erāmus"),    2: "PERFEKT"+tagSuffix("erātis"),    3: "PERFEKT"+tagSuffix("erant")}]}
  ];	
 var aKonjugationKonjunktivPlusquamperfektAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("issem"),    2: "PERFEKT"+tagSuffix("issēs"),    3: "PERFEKT"+tagSuffix("isset")}], Plural:[{1: "PERFEKT"+tagSuffix("issēmus"),    2: "PERFEKT"+tagSuffix("issētis"),    3: "PERFEKT"+tagSuffix("issent")}]}
  ];	
 var aKonjugationIndikativPlusquamperfektPassiv = [
  {Singular:[{1: "PPP"+"us eram",    2: "PPP"+"us erās",    3: "PPP"+"us erat"}], Plural:[{1: "PPP"+"ī erāmus",    2: "PPP"+"ī erātis",    3: "PPP"+"ī erant"}] }
  ];	
 var aKonjugationKonjunktivPlusquamperfektPassiv = [
  {Singular:[{1: "PPP"+"us essem",    2: "PPP"+"us essēs",    3: "PPP"+"us esset"}], Plural:[{1: "PPP"+"ī essēmus",    2: "PPP"+"ī essētis",    3: "PPP"+"ī essent"}] }
  ];
    //futurI
  var aKonjugationIndikativFuturIAktiv = [
  {Singular:[{1: "WORTSTAMM"+"ā"+tagInfix("b")+tagSuffix("o"),    2: "WORTSTAMM"+"ā"+tagInfix("bi")+tagSuffix("s"),    3: "WORTSTAMM"+"ā"+tagInfix("bi")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+"ā"+tagInfix("bi")+tagSuffix("mus"),    2: "WORTSTAMM"+"ā"+tagInfix("bi")+tagSuffix("tis"),    3: "WORTSTAMM"+"ā"+tagInfix("bu")+tagSuffix("nt")}]}
  ];
 var aKonjugationIndikativFuturIPassiv = [
  {Singular:[{1: "WORTSTAMM"+"ā"+tagInfix("b")+tagSuffix("or"),    2: "WORTSTAMM"+"ā"+tagInfix("be")+tagSuffix("ris"),    3: "WORTSTAMM"+"ā"+tagInfix("bi")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+"ā"+tagInfix("bi")+tagSuffix("mur"),    2: "WORTSTAMM"+"ā"+tagInfix("bi")+tagSuffix("minī"),    3: "WORTSTAMM"+"ā"+tagInfix("bu")+tagSuffix("ntur")}] }
  ];
    //futurII
  var aKonjugationIndikativFuturIIAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("erō"),    2: "PERFEKT"+tagSuffix("eris"),    3: "PERFEKT"+tagSuffix("erit")}], Plural:[{1: "PERFEKT"+tagSuffix("érimus"),    2: "PERFEKT"+tagSuffix("éritis"),    3: "PERFEKT"+tagSuffix("erint")}]}
  ];
 var aKonjugationIndikativFuturIIPassiv = [
  {Singular:[{1: "PPP"+"us erō",    2: "PPP"+"us eris",    3: "PPP"+"us erit"}], Plural:[{1: "PPP"+"ī erimus",    2: "PPP"+"ī eritis",    3: "PPP"+"ī erunt"}] }
  ];
 var aKonjugationImperativI = [ {Singular:[{2: "WORTSTAMM"+"ā"}], Plural:[{2: "WORTSTAMM"+"ā"+tagSuffix("te")}] }];
 var aKonjugationImperativII = [ {Singular:[{2: "WORTSTAMM"+"ā"+tagSuffix("tō"), 3: "WORTSTAMM"+"ā"+tagSuffix("tō")}], Plural:[{2: "WORTSTAMM"+"ā"+tagSuffix("tōte"), 3: "WORTSTAMM"+"a"+tagSuffix("ntō")}] }];
 var aKonjugation = [{Indikativ:[{Praesens:[{Aktiv:aKonjugationIndikativPraesensAktiv, Passiv:aKonjugationIndikativPraesensPassiv}],
								 Imperfekt:[{Aktiv:aKonjugationIndikativImperfektAktiv, Passiv:aKonjugationIndikativImperfektPassiv}],
								 Perfekt:[{Aktiv:aKonjugationIndikativPerfektAktiv, Passiv:aKonjugationIndikativPerfektPassiv}],
								 Plusquamperfekt:[{Aktiv:aKonjugationIndikativPlusquamperfektAktiv, Passiv:aKonjugationIndikativPlusquamperfektPassiv}],
								 Futu1:[{Aktiv:aKonjugationIndikativFuturIAktiv, Passiv:aKonjugationIndikativFuturIPassiv}],
								 Futu2:[{Aktiv:aKonjugationIndikativFuturIIAktiv, Passiv:aKonjugationIndikativFuturIIPassiv}]}
								], 
					  Konjunktiv:[{Praesens:[{Aktiv:aKonjugationKonjunktivPraesensAktiv, Passiv:aKonjugationKonjunktivPraesensPassiv}],
								  Imperfekt:[{Aktiv:aKonjugationKonjunktivImperfektAktiv, Passiv:aKonjugationKonjunktivImperfektPassiv}],
								  Perfekt:[{Aktiv:aKonjugationKonjunktivPerfektAktiv, Passiv:aKonjugationKonjunktivPerfektPassiv}],
								  Plusquamperfekt:[{Aktiv:aKonjugationKonjunktivPlusquamperfektAktiv, Passiv:aKonjugationKonjunktivPlusquamperfektPassiv}]}	  
					  ],
					  Imperativ:[{Impr1:[{Aktiv:aKonjugationImperativI}],
								  Impr2:[{Aktiv:aKonjugationImperativII}],
								 }  ],						  
					  }];
var aInfinitive = [{Praesens:[{Aktiv:"WORTSTAMM"+"ā"+tagSuffix("re"),	Passiv:"WORTSTAMM"+"ā"+tagSuffix("rī")}],
					Perfekt:[{Aktiv:"PERFEKT"+tagSuffix("isse"),		Passiv:"PPP"+"us, -a, um esse"}],
					Futur:[{Aktiv:"PFA"+"urus, -a, um esse",			Passiv:"PPP"+"um īrī"}]
}];
var eInfinitive = [{Praesens:[{Aktiv:"WORTSTAMM"+"ē"+tagSuffix("re"),	Passiv:"WORTSTAMM"+"ē"+tagSuffix("rī")}],
					Perfekt:[{Aktiv:"PERFEKT"+tagSuffix("isse"),		Passiv:"PPP"+"us, -a, um esse"}],
					Futur:[{Aktiv:"PFA"+"urus, -a, um esse",			Passiv:"PPP"+"um īrī"}]
}];
var iInfinitive = [{Praesens:[{Aktiv:"WORTSTAMM"+"ī"+tagSuffix("re"),	Passiv:"WORTSTAMM"+"ī"+tagSuffix("rī")}],
					Perfekt:[{Aktiv:"PERFEKT"+tagSuffix("isse"),		Passiv:"PPP"+"us, -a, um esse"}],
					Futur:[{Aktiv:"PFA"+"urus, -a, um esse",			Passiv:"PPP"+"um īrī"}]
}];
var gInfinitive = [{Praesens:[{Aktiv:"WORTSTAMM"+"e"+tagSuffix("re"),	Passiv:"WORTSTAMM"+tagSuffix("ī")}],
					Perfekt:[{Aktiv:"PERFEKT"+tagSuffix("isse"),		Passiv:"PPP"+"us, -a, um esse"}],
					Futur:[{Aktiv:"PFA"+"urus, -a, um esse",			Passiv:"PPP"+"um īrī"}]
}];
var kInfinitive = [{Praesens:[{Aktiv:"WORTSTAMM"+"e"+tagSuffix("re"),	Passiv:"WORTSTAMM"+tagSuffix("ī")}],
					Perfekt:[{Aktiv:"PERFEKT"+tagSuffix("isse"),		Passiv:"PPP"+"us, -a, um esse"}],
					Futur:[{Aktiv:"PFA"+"urus, -a, um esse",			Passiv:"PPP"+"um īrī"}]
}];
var esseInfinitive = [{Praesens:[{Aktiv:"ess"+"e",	Passiv:"-"}], 
					Perfekt:[{Aktiv:"PERFEKT"+tagSuffix("isse"),		Passiv:"-"}],
					Futur:[{Aktiv:"fut"+"ūrus, -a, um esse / fore",			Passiv:"-"}]
}];
var posseInfinitive = [{Praesens:[{Aktiv:"poss"+"e",	Passiv:"-"}],
					Perfekt:[{Aktiv:"PERFEKT"+tagSuffix("isse"),		Passiv:"-"}],
					Futur:[{Aktiv:"-",			Passiv:"-"}]
}];
					  
	// -ere e-konjugation
 //praesens
  var eKonjugationIndikativPraesensAktiv = [
  {Singular:[{1: "WORTSTAMM"+"e"+tagSuffix("ō"),    2: "WORTSTAMM"+"ē"+tagSuffix("s"),    3: "WORTSTAMM"+"e"+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+"ē"+tagSuffix("mus"),    2: "WORTSTAMM"+"ē"+tagSuffix("tis"),    3: "WORTSTAMM"+"e"+tagSuffix("nt")}]}
  ];	
 var eKonjugationKonjunktivPraesensAktiv = [
  {Singular:[{1: "WORTSTAMM"+"e"+tagInfix("a")+tagSuffix("m"),    2: "WORTSTAMM"+"e"+tagInfix("ā")+tagSuffix("s"),    3: "WORTSTAMM"+"e"+tagInfix("a")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+"e"+tagInfix("ā")+tagSuffix("mus"),    2: "WORTSTAMM"+"e"+tagInfix("ā")+tagSuffix("tis"),    3: "WORTSTAMM"+"e"+tagInfix("a")+tagSuffix("nt")}]}
  ];	
 var eKonjugationIndikativPraesensPassiv = [
  {Singular:[{1: "WORTSTAMM"+"e"+tagSuffix("or"),    2: "WORTSTAMM"+"ē"+tagSuffix("ris"),    3: "WORTSTAMM"+"ē"+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+"ē"+tagSuffix("mur"),    2: "WORTSTAMM"+"ē"+tagSuffix("minī"),    3: "WORTSTAMM"+"e"+tagSuffix("ntur")}] }
  ];	
 var eKonjugationKonjunktivPraesensPassiv = [
  {Singular:[{1: "WORTSTAMM"+"e"+tagInfix("a")+tagSuffix("r"),    2: "WORTSTAMM"+"e"+tagInfix("ā")+tagSuffix("ris"),    3: "WORTSTAMM"+"e"+tagInfix("ā")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+"e"+tagInfix("ā")+tagSuffix("mur"),    2: "WORTSTAMM"+"e"+tagInfix("ā")+tagSuffix("minī"),    3: "WORTSTAMM"+"e"+tagInfix("a")+tagSuffix("ntur")}] }
  ]; 
//imperfekt
  var eKonjugationIndikativImperfektAktiv = [
  {Singular:[{1: "WORTSTAMM"+"ē"+tagInfix("ba")+tagSuffix("m"),    2: "WORTSTAMM"+"ē"+tagInfix("bā")+tagSuffix("s"),    3: "WORTSTAMM"+"ē"+tagInfix("ba")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+"ē"+tagInfix("bā")+tagSuffix("mus"),    2: "WORTSTAMM"+"ē"+tagInfix("bā")+tagSuffix("tis"),    3: "WORTSTAMM"+"ē"+tagInfix("ba")+tagSuffix("nt")}]}
  ];	
 var eKonjugationKonjunktivImperfektAktiv = [
  {Singular:[{1: "WORTSTAMM"+"ē"+tagInfix("re")+tagSuffix("m"),    2: "WORTSTAMM"+"ē"+tagInfix("rē")+tagSuffix("s"),    3: "WORTSTAMM"+"ē"+tagInfix("re")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+"ē"+tagInfix("rē")+tagSuffix("mus"),    2: "WORTSTAMM"+"ē"+tagInfix("rē")+tagSuffix("tis"),    3: "WORTSTAMM"+"ē"+tagInfix("re")+tagSuffix("nt")}]}
  ];	
 var eKonjugationIndikativImperfektPassiv = [
  {Singular:[{1: "WORTSTAMM"+"ē"+tagInfix("ba")+tagSuffix("r"),    2: "WORTSTAMM"+"ē"+tagInfix("bā")+tagSuffix("ris"),    3: "WORTSTAMM"+"ē"+tagInfix("bā")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+"ē"+tagInfix("bā")+tagSuffix("mur"),    2: "WORTSTAMM"+"ē"+tagInfix("bā")+tagSuffix("minī"),    3: "WORTSTAMM"+"ē"+tagInfix("ba")+tagSuffix("ntur")}] }
  ];	
 var eKonjugationKonjunktivImperfektPassiv = [
  {Singular:[{1: "WORTSTAMM"+"ē"+tagInfix("re")+tagSuffix("r"),    2: "WORTSTAMM"+"ē"+tagInfix("rē")+tagSuffix("ris"),    3: "WORTSTAMM"+"ē"+tagInfix("rē")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+"ē"+tagInfix("rē")+tagSuffix("mur"),    2: "WORTSTAMM"+"ē"+tagInfix("rē")+tagSuffix("minī"),    3: "WORTSTAMM"+"ē"+tagInfix("re")+tagSuffix("ntur")}] }
  ];
  //perfekt
  var eKonjugationIndikativPerfektAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("ī"),    2: "PERFEKT"+tagSuffix("istī"),    3: "PERFEKT"+tagSuffix("it")}], Plural:[{1: "SHORTPERFEKT"+tagSuffix("imus"),    2: "PERFEKT"+tagSuffix("istis"),    3: "PERFEKT"+tagSuffix("ērunt")}]}
  ];	
 var eKonjugationKonjunktivPerfektAktiv = [
  {Singular:[{1: "SHORTPERFEKT"+tagSuffix("erim"),    2: "PERFEKT"+tagSuffix("eris"),    3: "PERFEKT"+tagSuffix("erit")}], Plural:[{1: "PERFEKT"+tagSuffix("érimus"),    2: "PERFEKT"+tagSuffix("éritis"),    3: "SHORTPERFEKT"+tagSuffix("erint")}]}
  ];	
 var eKonjugationIndikativPerfektPassiv = [
  {Singular:[{1: "PPP"+"us sum",    2: "PPP"+"us es",    3: "PPP"+"us est"}], Plural:[{1: "PPP"+"ī sumus",    2: "PPP"+"ī estis",    3: "PPP"+"ī sunt"}] }
  ];	
 var eKonjugationKonjunktivPerfektPassiv = [
  {Singular:[{1: "PPP"+"us sim",    2: "PPP"+"us sīs",    3: "PPP"+"us sit"}], Plural:[{1: "PPP"+"ī sīmus",    2: "PPP"+"ī sītis",    3: "PPP"+"ī sint"}] }
  ];
  //plusquamperfekt
  var eKonjugationIndikativPlusquamperfektAktiv = [
  {Singular:[{1: "SHORTPERFEKT"+tagSuffix("eram"),    2: "PERFEKT"+tagSuffix("erās"),    3: "PERFEKT"+tagSuffix("erat")}], Plural:[{1: "PERFEKT"+tagSuffix("erāmus"),    2: "PERFEKT"+tagSuffix("erātis"),    3: "SHORTPERFEKT"+tagSuffix("erant")}]}
  ];	
 var eKonjugationKonjunktivPlusquamperfektAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("issem"),    2: "PERFEKT"+tagSuffix("issēs"),    3: "PERFEKT"+tagSuffix("isset")}], Plural:[{1: "PERFEKT"+tagSuffix("issēmus"),    2: "PERFEKT"+tagSuffix("issētis"),    3: "PERFEKT"+tagSuffix("issent")}]}
  ];	
 var eKonjugationIndikativPlusquamperfektPassiv = [
  {Singular:[{1: "PPP"+"us eram",    2: "PPP"+"us erās",    3: "PPP"+"us erat"}], Plural:[{1: "PPP"+"ī erāmus",    2: "PPP"+"ī erātis",    3: "PPP"+"ī erant"}] }
  ];	
 var eKonjugationKonjunktivPlusquamperfektPassiv = [
  {Singular:[{1: "PPP"+"us essem",    2: "PPP"+"us essēs",    3: "PPP"+"us esset"}], Plural:[{1: "PPP"+"ī essēmus",    2: "PPP"+"ī essētis",    3: "PPP"+"ī essent"}] }
  ];
    //futurI
  var eKonjugationIndikativFuturIAktiv = [
  {Singular:[{1: "WORTSTAMM"+"ē"+tagInfix("b")+tagSuffix("o"),    2: "WORTSTAMM"+"ē"+tagInfix("bi")+tagSuffix("s"),    3: "WORTSTAMM"+"ē"+tagInfix("bi")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+"ē"+tagInfix("bi")+tagSuffix("mus"),    2: "WORTSTAMM"+"ē"+tagInfix("bi")+tagSuffix("tis"),    3: "WORTSTAMM"+"ē"+tagInfix("bu")+tagSuffix("nt")}]}
  ];
 var eKonjugationIndikativFuturIPassiv = [
  {Singular:[{1: "WORTSTAMM"+"ē"+tagInfix("b")+tagSuffix("or"),    2: "WORTSTAMM"+"ē"+tagInfix("be")+tagSuffix("ris"),    3: "WORTSTAMM"+"ē"+tagInfix("bi")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+"ē"+tagInfix("bi")+tagSuffix("mur"),    2: "WORTSTAMM"+"ē"+tagInfix("bi")+tagSuffix("minī"),    3: "WORTSTAMM"+"ē"+tagInfix("bu")+tagSuffix("ntur")}] }
  ];
    //futurII
  var eKonjugationIndikativFuturIIAktiv = [
  {Singular:[{1: "SHORTPERFEKT"+tagSuffix("erō"),    2: "PERFEKT"+tagSuffix("eris"),    3: "PERFEKT"+tagSuffix("erit")}], Plural:[{1: "PERFEKT"+tagSuffix("érimus"),    2: "PERFEKT"+tagSuffix("éritis"),    3: "SHORTPERFEKT"+tagSuffix("erint")}]}
  ];
 var eKonjugationIndikativFuturIIPassiv = [
  {Singular:[{1: "PPP"+"us erō",    2: "PPP"+"us eris",    3: "PPP"+"us erit"}], Plural:[{1: "PPP"+"ī erimus",    2: "PPP"+"ī eritis",    3: "PPP"+"ī erunt"}] }
  ];
 var eKonjugationImperativI = [ {Singular:[{2: "WORTSTAMM"+"ē"}], Plural:[{2: "WORTSTAMM"+"ē"+tagSuffix("te")}] }];
 var eKonjugationImperativII = [ {Singular:[{2: "WORTSTAMM"+"ē"+tagSuffix("tō"), 3: "WORTSTAMM"+"ē"+tagSuffix("tō")}], Plural:[{2: "WORTSTAMM"+"ē"+tagSuffix("tōte"), 3: "WORTSTAMM"+"e"+tagSuffix("ntō")}] }];
 var eKonjugation = [{Indikativ:[{Praesens:[{Aktiv:eKonjugationIndikativPraesensAktiv, Passiv:eKonjugationIndikativPraesensPassiv}],
								 Imperfekt:[{Aktiv:eKonjugationIndikativImperfektAktiv, Passiv:eKonjugationIndikativImperfektPassiv}],
								 Perfekt:[{Aktiv:eKonjugationIndikativPerfektAktiv, Passiv:eKonjugationIndikativPerfektPassiv}],
								 Plusquamperfekt:[{Aktiv:eKonjugationIndikativPlusquamperfektAktiv, Passiv:eKonjugationIndikativPlusquamperfektPassiv}],
								 Futu1:[{Aktiv:eKonjugationIndikativFuturIAktiv, Passiv:eKonjugationIndikativFuturIPassiv}],
								 Futu2:[{Aktiv:eKonjugationIndikativFuturIIAktiv, Passiv:eKonjugationIndikativFuturIIPassiv}]}
								], 
					  Konjunktiv:[{Praesens:[{Aktiv:eKonjugationKonjunktivPraesensAktiv, Passiv:eKonjugationKonjunktivPraesensPassiv}],
								  Imperfekt:[{Aktiv:eKonjugationKonjunktivImperfektAktiv, Passiv:eKonjugationKonjunktivImperfektPassiv}],
								  Perfekt:[{Aktiv:eKonjugationKonjunktivPerfektAktiv, Passiv:eKonjugationKonjunktivPerfektPassiv}],
								  Plusquamperfekt:[{Aktiv:eKonjugationKonjunktivPlusquamperfektAktiv, Passiv:eKonjugationKonjunktivPlusquamperfektPassiv}]}	  
					  ],
					  Imperativ:[{Impr1:[{Aktiv:eKonjugationImperativI}],
								  Impr2:[{Aktiv:eKonjugationImperativII}],
								 }  ],						  
					  }];
  
 	// -ire i-Konjugation
 //praesens
  var iKonjugationIndikativPraesensAktiv = [
  {Singular:[{1: "WORTSTAMM"+"i"+tagSuffix("ō"),    2: "WORTSTAMM"+"ī"+tagSuffix("s"),    3: "WORTSTAMM"+"i"+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+"ī"+tagSuffix("mus"),    2: "WORTSTAMM"+"ī"+tagSuffix("tis"),    3: "WORTSTAMM"+"i"+tagInfix("u")+tagSuffix("nt")}]}
  ];	
 var iKonjugationKonjunktivPraesensAktiv = [
  {Singular:[{1: "WORTSTAMM"+"i"+tagInfix("a")+tagSuffix("m"),    2: "WORTSTAMM"+"i"+tagInfix("ā")+tagSuffix("s"),    3: "WORTSTAMM"+"i"+tagInfix("a")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+"i"+tagInfix("ā")+tagSuffix("mus"),    2: "WORTSTAMM"+"i"+tagInfix("ā")+tagSuffix("tis"),    3: "WORTSTAMM"+"i"+tagInfix("a")+tagSuffix("nt")}]}
  ];	
 var iKonjugationIndikativPraesensPassiv = [
  {Singular:[{1: "WORTSTAMM"+"i"+tagSuffix("or"),    2: "WORTSTAMM"+"ī"+tagSuffix("ris"),    3: "WORTSTAMM"+"ī"+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+"ī"+tagSuffix("mur"),    2: "WORTSTAMM"+"ī"+tagSuffix("minī"),    3: "WORTSTAMM"+"i"+tagInfix("u")+tagSuffix("ntur")}] }
  ];	
 var iKonjugationKonjunktivPraesensPassiv = [
  {Singular:[{1: "WORTSTAMM"+"i"+tagInfix("a")+tagSuffix("r"),    2: "WORTSTAMM"+"i"+tagInfix("ā")+tagSuffix("ris"),    3: "WORTSTAMM"+"i"+tagInfix("ā")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+"i"+tagInfix("ā")+tagSuffix("mur"),    2: "WORTSTAMM"+"i"+tagInfix("ā")+tagSuffix("minī"),    3: "WORTSTAMM"+"i"+tagInfix("a")+tagSuffix("ntur")}] }
  ]; 
//imperfekt
  var iKonjugationIndikativImperfektAktiv = [
  {Singular:[{1: "WORTSTAMM"+"i"+tagInfix("ēba")+tagSuffix("m"),    2: "WORTSTAMM"+"i"+tagInfix("ēbā")+tagSuffix("s"),    3: "WORTSTAMM"+"i"+tagInfix("ēba")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+"i"+tagInfix("ēbā")+tagSuffix("mus"),    2: "WORTSTAMM"+"i"+tagInfix("ēbā")+tagSuffix("tis"),    3: "WORTSTAMM"+"i"+tagInfix("ēba")+tagSuffix("nt")}]}
  ];	
 var iKonjugationKonjunktivImperfektAktiv = [
  {Singular:[{1: "WORTSTAMM"+"ī"+tagInfix("re")+tagSuffix("m"),    2: "WORTSTAMM"+"ī"+tagInfix("rē")+tagSuffix("s"),    3: "WORTSTAMM"+"ī"+tagInfix("re")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+"ī"+tagInfix("rē")+tagSuffix("mus"),    2: "WORTSTAMM"+"ī"+tagInfix("rē")+tagSuffix("tis"),    3: "WORTSTAMM"+"ī"+tagInfix("re")+tagSuffix("nt")}]}
  ];	
 var iKonjugationIndikativImperfektPassiv = [
  {Singular:[{1: "WORTSTAMM"+"i"+tagInfix("ēba")+tagSuffix("r"),    2: "WORTSTAMM"+"i"+tagInfix("ēbā")+tagSuffix("ris"),    3: "WORTSTAMM"+"i"+tagInfix("ēbā")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+"i"+tagInfix("ēbā")+tagSuffix("mur"),    2: "WORTSTAMM"+"i"+tagInfix("ēbā")+tagSuffix("minī"),    3: "WORTSTAMM"+"i"+tagInfix("ēba")+tagSuffix("ntur")}] }
  ];	
 var iKonjugationKonjunktivImperfektPassiv = [
  {Singular:[{1: "WORTSTAMM"+"ī"+tagInfix("re")+tagSuffix("r"),    2: "WORTSTAMM"+"ī"+tagInfix("rē")+tagSuffix("ris"),    3: "WORTSTAMM"+"ī"+tagInfix("rē")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+"ī"+tagInfix("rē")+tagSuffix("mur"),    2: "WORTSTAMM"+"ī"+tagInfix("rē")+tagSuffix("minī"),    3: "WORTSTAMM"+"ī"+tagInfix("re")+tagSuffix("ntur")}] }
  ];
  //perfekt
  var iKonjugationIndikativPerfektAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("ī"),    2: "PERFEKT"+tagSuffix("istī"),    3: "PERFEKT"+tagSuffix("it")}], Plural:[{1: "PERFEKT"+tagSuffix("imus"),    2: "PERFEKT"+tagSuffix("istis"),    3: "PERFEKT"+tagSuffix("ērunt")}]}
  ];	
 var iKonjugationKonjunktivPerfektAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("erim"),    2: "PERFEKT"+tagSuffix("eris"),    3: "PERFEKT"+tagSuffix("erit")}], Plural:[{1: "PERFEKT"+tagSuffix("érimus"),    2: "PERFEKT"+tagSuffix("éritis"),    3: "PERFEKT"+tagSuffix("erint")}]}
  ];	
 var iKonjugationIndikativPerfektPassiv = [
  {Singular:[{1: "PPP"+"us sum",    2: "PPP"+"us es",    3: "PPP"+"us est"}], Plural:[{1: "PPP"+"ī sumus",    2: "PPP"+"ī estis",    3: "PPP"+"ī sunt"}] }
  ];	
 var iKonjugationKonjunktivPerfektPassiv = [
  {Singular:[{1: "PPP"+"us sim",    2: "PPP"+"us sīs",    3: "PPP"+"us sit"}], Plural:[{1: "PPP"+"ī sīmus",    2: "PPP"+"ī sītis",    3: "PPP"+"ī sint"}] }
  ];
  //plusquamperfekt
  var iKonjugationIndikativPlusquamperfektAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("eram"),    2: "PERFEKT"+tagSuffix("erās"),    3: "PERFEKT"+tagSuffix("erat")}], Plural:[{1: "PERFEKT"+tagSuffix("erāmus"),    2: "PERFEKT"+tagSuffix("erātis"),    3: "PERFEKT"+tagSuffix("erant")}]}
  ];	
 var iKonjugationKonjunktivPlusquamperfektAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("issem"),    2: "PERFEKT"+tagSuffix("issēs"),    3: "PERFEKT"+tagSuffix("isset")}], Plural:[{1: "PERFEKT"+tagSuffix("issēmus"),    2: "PERFEKT"+tagSuffix("issētis"),    3: "PERFEKT"+tagSuffix("issent")}]}
  ];	
 var iKonjugationIndikativPlusquamperfektPassiv = [
  {Singular:[{1: "PPP"+"us eram",    2: "PPP"+"us erās",    3: "PPP"+"us erat"}], Plural:[{1: "PPP"+"ī erāmus",    2: "PPP"+"ī erātis",    3: "PPP"+"ī erant"}] }
  ];	
 var iKonjugationKonjunktivPlusquamperfektPassiv = [
  {Singular:[{1: "PPP"+"us essem",    2: "PPP"+"us essēs",    3: "PPP"+"us esset"}], Plural:[{1: "PPP"+"ī essēmus",    2: "PPP"+"ī essētis",    3: "PPP"+"ī essent"}] }
  ];
    //futurI
  var iKonjugationIndikativFuturIAktiv = [
  {Singular:[{1: "WORTSTAMM"+"i"+tagInfix("a")+tagSuffix("m"),    2: "WORTSTAMM"+"i"+tagInfix("ē")+tagSuffix("s"),    3: "WORTSTAMM"+"i"+tagInfix("e")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+"i"+tagInfix("ē")+tagSuffix("mus"),    2: "WORTSTAMM"+"i"+tagInfix("ē")+tagSuffix("tis"),    3: "WORTSTAMM"+"i"+tagInfix("e")+tagSuffix("nt")}]}
  ];
 var iKonjugationIndikativFuturIPassiv = [
  {Singular:[{1: "WORTSTAMM"+"i"+tagInfix("a")+tagSuffix("r"),    2: "WORTSTAMM"+"i"+tagInfix("ē")+tagSuffix("ris"),    3: "WORTSTAMM"+"i"+tagInfix("ē")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+"i"+tagInfix("ē")+tagSuffix("mur"),    2: "WORTSTAMM"+"i"+tagInfix("ē")+tagSuffix("minī"),    3: "WORTSTAMM"+"i"+tagInfix("e")+tagSuffix("ntur")}] }
  ];
    //futurII
  var iKonjugationIndikativFuturIIAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("erō"),    2: "PERFEKT"+tagSuffix("eris"),    3: "PERFEKT"+tagSuffix("erit")}], Plural:[{1: "PERFEKT"+tagSuffix("érimus"),    2: "PERFEKT"+tagSuffix("éritis"),    3: "PERFEKT"+tagSuffix("erint")}]}
  ];
 var iKonjugationIndikativFuturIIPassiv = [
  {Singular:[{1: "PPP"+"us erō",    2: "PPP"+"us eris",    3: "PPP"+"us erit"}], Plural:[{1: "PPP"+"ī erimus",    2: "PPP"+"ī eritis",    3: "PPP"+"ī erunt"}] }
  ];
 var iKonjugationImperativI = [ {Singular:[{2: "WORTSTAMM"+"ī"}], Plural:[{2: "WORTSTAMM"+"ī"+tagSuffix("te")}] }];
 var iKonjugationImperativII = [ {Singular:[{2: "WORTSTAMM"+"ī"+tagSuffix("tō"), 3: "WORTSTAMM"+"ī"+tagSuffix("tō")}], Plural:[{2: "WORTSTAMM"+"ī"+tagSuffix("tōte"), 3: "WORTSTAMM"+"i"+tagInfix("u")+tagSuffix("ntō")}] }];
 var iKonjugation = [{Indikativ:[{Praesens:[{Aktiv:iKonjugationIndikativPraesensAktiv, Passiv:iKonjugationIndikativPraesensPassiv}],
								 Imperfekt:[{Aktiv:iKonjugationIndikativImperfektAktiv, Passiv:iKonjugationIndikativImperfektPassiv}],
								 Perfekt:[{Aktiv:iKonjugationIndikativPerfektAktiv, Passiv:iKonjugationIndikativPerfektPassiv}],
								 Plusquamperfekt:[{Aktiv:iKonjugationIndikativPlusquamperfektAktiv, Passiv:iKonjugationIndikativPlusquamperfektPassiv}],
								 Futu1:[{Aktiv:iKonjugationIndikativFuturIAktiv, Passiv:iKonjugationIndikativFuturIPassiv}],
								 Futu2:[{Aktiv:iKonjugationIndikativFuturIIAktiv, Passiv:iKonjugationIndikativFuturIIPassiv}]}
								], 
					  Konjunktiv:[{Praesens:[{Aktiv:iKonjugationKonjunktivPraesensAktiv, Passiv:iKonjugationKonjunktivPraesensPassiv}],
								  Imperfekt:[{Aktiv:iKonjugationKonjunktivImperfektAktiv, Passiv:iKonjugationKonjunktivImperfektPassiv}],
								  Perfekt:[{Aktiv:iKonjugationKonjunktivPerfektAktiv, Passiv:iKonjugationKonjunktivPerfektPassiv}],
								  Plusquamperfekt:[{Aktiv:iKonjugationKonjunktivPlusquamperfektAktiv, Passiv:iKonjugationKonjunktivPlusquamperfektPassiv}]}	  
					  ],
					  Imperativ:[{Impr1:[{Aktiv:iKonjugationImperativI}],
								  Impr2:[{Aktiv:iKonjugationImperativII}],
								 }  ],						  
					  }];
					  
 	// -ere konsonantische Konjugation
 //praesens
  var kKonjugationIndikativPraesensAktiv = [
  {Singular:[{1: "WORTSTAMM"+tagSuffix("ō"),    2: "WORTSTAMM"+tagInfix("i")+tagSuffix("s"),    3: "WORTSTAMM"+tagInfix("i")+tagSuffix("t")}], Plural:[{1: "SHORTWORTSTAMM"+tagInfix("i")+tagSuffix("mus"),    2: "SHORTWORTSTAMM"+tagInfix("i")+tagSuffix("tis"),    3: "WORTSTAMM"+tagInfix("u")+tagSuffix("nt")}]}
  ];	
 var kKonjugationKonjunktivPraesensAktiv = [
  {Singular:[{1: "WORTSTAMM"+tagInfix("a")+tagSuffix("m"),    2: "WORTSTAMM"+tagInfix("ā")+tagSuffix("s"),    3: "WORTSTAMM"+tagInfix("a")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+tagInfix("ā")+tagSuffix("mus"),    2: "WORTSTAMM"+tagInfix("ā")+tagSuffix("tis"),    3: "WORTSTAMM"+tagInfix("a")+tagSuffix("nt")}]}
  ];	
 var kKonjugationIndikativPraesensPassiv = [
  {Singular:[{1: "WORTSTAMM"+tagSuffix("or"),    2: "SHORTWORTSTAMM"+tagInfix("e")+tagSuffix("ris"),    3: "WORTSTAMM"+tagInfix("i")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+tagInfix("i")+tagSuffix("mur"),    2: "WORTSTAMM"+tagInfix("i")+tagSuffix("minī"),    3: "WORTSTAMM"+tagInfix("u")+tagSuffix("ntur")}] }
  ];	
 var kKonjugationKonjunktivPraesensPassiv = [
  {Singular:[{1: "WORTSTAMM"+tagInfix("a")+tagSuffix("r"),    2: "WORTSTAMM"+tagInfix("ā")+tagSuffix("ris"),    3: "WORTSTAMM"+tagInfix("ā")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+tagInfix("ā")+tagSuffix("mur"),    2: "WORTSTAMM"+tagInfix("ā")+tagSuffix("minī"),    3: "WORTSTAMM"+tagInfix("a")+tagSuffix("ntur")}] }
  ]; 
//imperfekt
  var kKonjugationIndikativImperfektAktiv = [
  {Singular:[{1: "WORTSTAMM"+tagInfix("ēba")+tagSuffix("m"),    2: "WORTSTAMM"+tagInfix("ēbā")+tagSuffix("s"),    3: "WORTSTAMM"+tagInfix("ēba")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+tagInfix("ēbā")+tagSuffix("mus"),    2: "WORTSTAMM"+tagInfix("ēbā")+tagSuffix("tis"),    3: "WORTSTAMM"+tagInfix("ēba")+tagSuffix("nt")}]}
  ];	
 var kKonjugationKonjunktivImperfektAktiv = [
  {Singular:[{1: "SHORTWORTSTAMM"+tagInfix("ere")+tagSuffix("m"),    2: "WORTSTAMM"+tagInfix("erē")+tagSuffix("s"),    3: "WORTSTAMM"+tagInfix("ere")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+tagInfix("erē")+tagSuffix("mus"),    2: "WORTSTAMM"+tagInfix("erē")+tagSuffix("tis"),    3: "WORTSTAMM"+tagInfix("ere")+tagSuffix("nt")}]}
  ];	
 var kKonjugationIndikativImperfektPassiv = [
  {Singular:[{1: "WORTSTAMM"+tagInfix("ēba")+tagSuffix("r"),    2: "WORTSTAMM"+tagInfix("ēbā")+tagSuffix("ris"),    3: "WORTSTAMM"+tagInfix("ēbā")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+tagInfix("ēbā")+tagSuffix("mur"),    2: "WORTSTAMM"+tagInfix("ēbā")+tagSuffix("minī"),    3: "WORTSTAMM"+tagInfix("ēba")+tagSuffix("ntur")}] }
  ];	
 var kKonjugationKonjunktivImperfektPassiv = [
  {Singular:[{1: "SHORTWORTSTAMM"+tagInfix("ere")+tagSuffix("r"),    2: "WORTSTAMM"+tagInfix("erē")+tagSuffix("ris"),    3: "WORTSTAMM"+tagInfix("erē")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+tagInfix("erē")+tagSuffix("mur"),    2: "WORTSTAMM"+tagInfix("erē")+tagSuffix("minī"),    3: "WORTSTAMM"+tagInfix("ere")+tagSuffix("ntur")}] }
  ];
  //perfekt
  var kKonjugationIndikativPerfektAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("ī"),    2: "PERFEKT"+tagSuffix("istī"),    3: "PERFEKT"+tagSuffix("it")}], Plural:[{1: "PERFEKT"+tagSuffix("imus"),    2: "PERFEKT"+tagSuffix("istis"),    3: "PERFEKT"+tagSuffix("ērunt")}]}
  ];	
 var kKonjugationKonjunktivPerfektAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("erim"),    2: "PERFEKT"+tagSuffix("eris"),    3: "PERFEKT"+tagSuffix("erit")}], Plural:[{1: "PERFEKT"+tagSuffix("érimus"),    2: "PERFEKT"+tagSuffix("éritis"),    3: "PERFEKT"+tagSuffix("erint")}]}
  ];	
 var kKonjugationIndikativPerfektPassiv = [
  {Singular:[{1: "PPP"+"us sum",    2: "PPP"+"us es",    3: "PPP"+"us est"}], Plural:[{1: "PPP"+"ī sumus",    2: "PPP"+"ī estis",    3: "PPP"+"ī sunt"}] }
  ];	
 var kKonjugationKonjunktivPerfektPassiv = [
  {Singular:[{1: "PPP"+"us sim",    2: "PPP"+"us sīs",    3: "PPP"+"us sit"}], Plural:[{1: "PPP"+"ī sīmus",    2: "PPP"+"ī sītis",    3: "PPP"+"ī sint"}] }
  ];
  //plusquamperfekt
  var kKonjugationIndikativPlusquamperfektAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("eram"),    2: "PERFEKT"+tagSuffix("erās"),    3: "PERFEKT"+tagSuffix("erat")}], Plural:[{1: "PERFEKT"+tagSuffix("erāmus"),    2: "PERFEKT"+tagSuffix("erātis"),    3: "PERFEKT"+tagSuffix("erant")}]}
  ];	
 var kKonjugationKonjunktivPlusquamperfektAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("issem"),    2: "PERFEKT"+tagSuffix("issēs"),    3:"PERFEKT"+tagSuffix("isset")}], Plural:[{1: "PERFEKT"+tagSuffix("issēmus"),    2: "PERFEKT"+tagSuffix("issētis"),    3: "PERFEKT"+tagSuffix("issent")}]}
  ];	
 var kKonjugationIndikativPlusquamperfektPassiv = [
  {Singular:[{1: "PPP"+"us eram",    2: "PPP"+"us erās",    3: "PPP"+"us erat"}], Plural:[{1: "PPP"+"ī erāmus",    2: "PPP"+"ī erātis",    3: "PPP"+"ī erant"}] }
  ];	
 var kKonjugationKonjunktivPlusquamperfektPassiv = [
  {Singular:[{1: "PPP"+"us essem",    2: "PPP"+"us essēs",    3: "PPP"+"us esset"}], Plural:[{1: "PPP"+"ī essēmus",    2: "PPP"+"ī essētis",    3: "PPP"+"ī essent"}] }
  ];
    //futurI
  var kKonjugationIndikativFuturIAktiv = [
  {Singular:[{1: "WORTSTAMM"+tagInfix("a")+tagSuffix("m"),    2: "WORTSTAMM"+tagInfix("ē")+tagSuffix("s"),    3: "WORTSTAMM"+tagInfix("e")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+tagInfix("ē")+tagSuffix("mus"),    2: "WORTSTAMM"+tagInfix("ē")+tagSuffix("tis"),    3: "WORTSTAMM"+tagInfix("e")+tagSuffix("nt")}]}
  ];
 var kKonjugationIndikativFuturIPassiv = [
  {Singular:[{1: "WORTSTAMM"+tagInfix("a")+tagSuffix("r"),    2: "WORTSTAMM"+tagInfix("ē")+tagSuffix("ris"),    3: "WORTSTAMM"+tagInfix("ē")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+tagInfix("ē")+tagSuffix("mur"),    2: "WORTSTAMM"+tagInfix("ē")+tagSuffix("minī"),    3: "WORTSTAMM"+tagInfix("e")+tagSuffix("ntur")}] }
  ];
    //futurII
  var kKonjugationIndikativFuturIIAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("erō"),    2: "PERFEKT"+tagSuffix("eris"),    3: "PERFEKT"+tagSuffix("erit")}], Plural:[{1: "PERFEKT"+tagSuffix("érimus"),    2: "PERFEKT"+tagSuffix("éritis"),    3: "PERFEKT"+tagSuffix("erint")}]}
  ];
 var kKonjugationIndikativFuturIIPassiv = [
  {Singular:[{1: "PPP"+"us erō",    2: "PPP"+"us eris",    3: "PPP"+"us erit"}], Plural:[{1: "PPP"+"ī erimus",    2: "PPP"+"ī eritis",    3: "PPP"+"ī erunt"}] }
  ];
 var kKonjugationImperativI = [ {Singular:[{2: "WORTSTAMM"+"e"}], Plural:[{2: "WORTSTAMM"+"i"+tagSuffix("te")}] }];
 var kKonjugationImperativII = [ {Singular:[{2: "WORTSTAMM"+"i"+tagSuffix("tō"), 3: "WORTSTAMM"+"i"+tagSuffix("tō")}], Plural:[{2: "WORTSTAMM"+"i"+tagSuffix("tōte"), 3: "WORTSTAMM"+tagInfix("u")+tagSuffix("ntō")}] }];
 var kKonjugation = [{Indikativ:[{Praesens:[{Aktiv:kKonjugationIndikativPraesensAktiv, Passiv:kKonjugationIndikativPraesensPassiv}],
								 Imperfekt:[{Aktiv:kKonjugationIndikativImperfektAktiv, Passiv:kKonjugationIndikativImperfektPassiv}],
								 Perfekt:[{Aktiv:kKonjugationIndikativPerfektAktiv, Passiv:kKonjugationIndikativPerfektPassiv}],
								 Plusquamperfekt:[{Aktiv:kKonjugationIndikativPlusquamperfektAktiv, Passiv:kKonjugationIndikativPlusquamperfektPassiv}],
								 Futu1:[{Aktiv:kKonjugationIndikativFuturIAktiv, Passiv:kKonjugationIndikativFuturIPassiv}],
								 Futu2:[{Aktiv:kKonjugationIndikativFuturIIAktiv, Passiv:kKonjugationIndikativFuturIIPassiv}]}
								], 
					  Konjunktiv:[{Praesens:[{Aktiv:kKonjugationKonjunktivPraesensAktiv, Passiv:kKonjugationKonjunktivPraesensPassiv}],
								  Imperfekt:[{Aktiv:kKonjugationKonjunktivImperfektAktiv, Passiv:kKonjugationKonjunktivImperfektPassiv}],
								  Perfekt:[{Aktiv:kKonjugationKonjunktivPerfektAktiv, Passiv:kKonjugationKonjunktivPerfektPassiv}],
								  Plusquamperfekt:[{Aktiv:kKonjugationKonjunktivPlusquamperfektAktiv, Passiv:kKonjugationKonjunktivPlusquamperfektPassiv}]}	  
					  ],
					  Imperativ:[{Impr1:[{Aktiv:kKonjugationImperativI}],
								  Impr2:[{Aktiv:kKonjugationImperativII}],
								 }  ],							  
					  }];
 	// -ere gemischte Konjugation
 //praesens
  var gKonjugationIndikativPraesensAktiv = [
  {Singular:[{1: "WORTSTAMM"+tagInfix("i")+tagSuffix("ō"),    2: "WORTSTAMM"+tagInfix("i")+tagSuffix("s"),    3: "WORTSTAMM"+tagInfix("i")+tagSuffix("t")}], Plural:[{1: "SHORTWORTSTAMM"+tagInfix("i")+tagSuffix("mus"),    2: "SHORTWORTSTAMM"+tagInfix("i")+tagSuffix("tis"),    3: "WORTSTAMM"+tagInfix("iu")+tagSuffix("nt")}]}
  ];	
 var gKonjugationKonjunktivPraesensAktiv = [
  {Singular:[{1: "WORTSTAMM"+"i"+tagInfix("a")+tagSuffix("m"),    2: "WORTSTAMM"+"i"+tagInfix("ā")+tagSuffix("s"),    3: "WORTSTAMM"+"i"+tagInfix("a")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+"i"+tagInfix("ā")+tagSuffix("mus"),    2: "WORTSTAMM"+"i"+tagInfix("ā")+tagSuffix("tis"),    3: "WORTSTAMM"+"i"+tagInfix("a")+tagSuffix("nt")}]}
  ];	
 var gKonjugationIndikativPraesensPassiv = [
  {Singular:[{1: "WORTSTAMM"+tagInfix("i")+tagSuffix("or"),    2: "SHORTWORTSTAMM"+tagInfix("ě")+tagSuffix("ris"),    3: "WORTSTAMM"+tagInfix("i")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+tagInfix("i")+tagSuffix("mur"),    2: "WORTSTAMM"+tagInfix("i")+tagSuffix("minī"),    3: "WORTSTAMM"+tagInfix("iu")+tagSuffix("ntur")}] }
  ];	
 var gKonjugationKonjunktivPraesensPassiv = [
  {Singular:[{1: "WORTSTAMM"+"i"+tagInfix("a")+tagSuffix("r"),    2: "WORTSTAMM"+"i"+tagInfix("ā")+tagSuffix("ris"),    3: "WORTSTAMM"+"i"+tagInfix("ā")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+"i"+tagInfix("ā")+tagSuffix("mur"),    2: "WORTSTAMM"+"i"+tagInfix("ā")+tagSuffix("minī"),    3: "WORTSTAMM"+"i"+tagInfix("a")+tagSuffix("ntur")}] }
  ]; 
//imperfekt
  var gKonjugationIndikativImperfektAktiv = [
  {Singular:[{1: "WORTSTAMM"+"i"+tagInfix("ēba")+tagSuffix("m"),    2: "WORTSTAMM"+"i"+tagInfix("ēbā")+tagSuffix("s"),    3: "WORTSTAMM"+"i"+tagInfix("ēba")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+"i"+tagInfix("ēbā")+tagSuffix("mus"),    2: "WORTSTAMM"+"i"+tagInfix("ēbā")+tagSuffix("tis"),    3: "WORTSTAMM"+"i"+tagInfix("ēba")+tagSuffix("nt")}]}
  ];	
 var gKonjugationKonjunktivImperfektAktiv = [
  {Singular:[{1: "SHORTWORTSTAMM"+tagInfix("ere")+tagSuffix("m"),    2: "WORTSTAMM"+tagInfix("erē")+tagSuffix("s"),    3: "WORTSTAMM"+tagInfix("ere")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+tagInfix("erē")+tagSuffix("mus"),    2: "WORTSTAMM"+tagInfix("erē")+tagSuffix("tis"),    3: "WORTSTAMM"+tagInfix("ere")+tagSuffix("nt")}]}
  ];	
 var gKonjugationIndikativImperfektPassiv = [
  {Singular:[{1: "WORTSTAMM"+"i"+tagInfix("ēba")+tagSuffix("r"),    2: "WORTSTAMM"+"i"+"ēbā"+tagSuffix("ris"),    3: "WORTSTAMM"+"i"+"ēbā"+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+"i"+"ēbā"+tagSuffix("mur"),    2: "WORTSTAMM"+"i"+"ēbā"+tagSuffix("minī"),    3: "WORTSTAMM"+"i"+"ēba"+tagSuffix("ntur")}] }
  ];	
 var gKonjugationKonjunktivImperfektPassiv = [
  {Singular:[{1: "SHORTWORTSTAMM"+tagInfix("ere")+tagSuffix("r"),    2: "WORTSTAMM"+tagInfix("erē")+tagSuffix("ris"),    3: "WORTSTAMM"+tagInfix("erē")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+tagInfix("erē")+tagSuffix("mur"),    2: "WORTSTAMM"+tagInfix("erē")+tagSuffix("minī"),    3: "WORTSTAMM"+tagInfix("ere")+tagSuffix("ntur")}] }
  ];
  //perfekt
  var gKonjugationIndikativPerfektAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("ī"),    2: "PERFEKT"+tagSuffix("istī"),    3: "PERFEKT"+tagSuffix("it")}], Plural:[{1: "PERFEKT"+tagSuffix("imus"),    2: "PERFEKT"+tagSuffix("istis"),    3: "PERFEKT"+tagSuffix("ērunt")}]}
  ];	
 var gKonjugationKonjunktivPerfektAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("erim"),    2: "PERFEKT"+tagSuffix("eris"),    3: "PERFEKT"+tagSuffix("erit")}], Plural:[{1: "PERFEKT"+tagSuffix("érimus"),    2: "PERFEKT"+tagSuffix("éritis"),    3: "PERFEKT"+tagSuffix("erint")}]}
  ];	
 var gKonjugationIndikativPerfektPassiv = [
  {Singular:[{1: "PPP"+"us sum",    2: "PPP"+"us es",    3: "PPP"+"us est"}], Plural:[{1: "PPP"+"ī sumus",    2: "PPP"+"ī estis",    3: "PPP"+"ī sunt"}] }
  ];	
 var gKonjugationKonjunktivPerfektPassiv = [
  {Singular:[{1: "PPP"+"us sim",    2: "PPP"+"us sīs",    3: "PPP"+"us sit"}], Plural:[{1: "PPP"+"ī sīmus",    2: "PPP"+"ī sītis",    3: "PPP"+"ī sint"}] }
  ];
  //plusquamperfekt
  var gKonjugationIndikativPlusquamperfektAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("eram"),    2: "PERFEKT"+tagSuffix("erās"),    3: "PERFEKT"+tagSuffix("erat")}], Plural:[{1: "PERFEKT"+tagSuffix("erāmus"),    2: "PERFEKT"+tagSuffix("erātis"),    3: "PERFEKT"+tagSuffix("erant")}]}
  ];	
 var gKonjugationKonjunktivPlusquamperfektAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("issem"),    2: "PERFEKT"+tagSuffix("issēs"),    3:"PERFEKT"+tagSuffix("isset")}], Plural:[{1: "PERFEKT"+tagSuffix("issēmus"),    2: "PERFEKT"+tagSuffix("issētis"),    3: "PERFEKT"+tagSuffix("issent")}]}
  ];	
 var gKonjugationIndikativPlusquamperfektPassiv = [
  {Singular:[{1: "PPP"+"us eram",    2: "PPP"+"us erās",    3: "PPP"+"us erat"}], Plural:[{1: "PPP"+"ī erāmus",    2: "PPP"+"ī erātis",    3: "PPP"+"ī erant"}] }
  ];	
 var gKonjugationKonjunktivPlusquamperfektPassiv = [
  {Singular:[{1: "PPP"+"us essem",    2: "PPP"+"us essēs",    3: "PPP"+"us esset"}], Plural:[{1: "PPP"+"ī essēmus",    2: "PPP"+"ī essētis",    3: "PPP"+"ī essent"}] }
  ];
    //futurI
  var gKonjugationIndikativFuturIAktiv = [
  {Singular:[{1: "WORTSTAMM"+"i"+tagInfix("a")+tagSuffix("m"),    2: "WORTSTAMM"+"i"+tagInfix("ē")+tagSuffix("s"),    3: "WORTSTAMM"+"i"+tagInfix("e")+tagSuffix("t")}], Plural:[{1: "WORTSTAMM"+"i"+tagInfix("ē")+tagSuffix("mus"),    2: "WORTSTAMM"+"i"+tagInfix("ē")+tagSuffix("tis"),    3: "WORTSTAMM"+"i"+tagInfix("e")+tagSuffix("nt")}]}
  ];
 var gKonjugationIndikativFuturIPassiv = [
  {Singular:[{1: "WORTSTAMM"+"i"+tagInfix("a")+tagSuffix("r"),    2: "WORTSTAMM"+"i"+tagInfix("ē")+tagSuffix("ris"),    3: "WORTSTAMM"+"i"+tagInfix("ē")+tagSuffix("tur")}], Plural:[{1: "WORTSTAMM"+"i"+tagInfix("ē")+tagSuffix("mur"),    2: "WORTSTAMM"+"i"+tagInfix("ē")+tagSuffix("minī"),    3: "WORTSTAMM"+"i"+tagInfix("e")+tagSuffix("ntur")}] }
  ];
    //futurII
  var gKonjugationIndikativFuturIIAktiv = [
  {Singular:[{1: "PERFEKT"+tagSuffix("erō"),    2: "PERFEKT"+tagSuffix("eris"),    3: "PERFEKT"+tagSuffix("erit")}], Plural:[{1: "PERFEKT"+tagSuffix("érimus"),    2: "PERFEKT"+tagSuffix("éritis"),    3: "PERFEKT"+tagSuffix("erint")}]}
  ];
 var gKonjugationIndikativFuturIIPassiv = [
  {Singular:[{1: "PPP"+"us erō",    2: "PPP"+"us eris",    3: "PPP"+"us erit"}], Plural:[{1: "PPP"+"ī erimus",    2: "PPP"+"ī eritis",    3: "PPP"+"ī erunt"}] }
  ];
 var gKonjugationImperativI = [ {Singular:[{2: "WORTSTAMM"+"e"}], Plural:[{2: "WORTSTAMM"+"i"+tagSuffix("te")}] }];
 var gKonjugationImperativII = [ {Singular:[{2: "WORTSTAMM"+"i"+tagSuffix("tō"), 3: "WORTSTAMM"+"i"+tagSuffix("tō")}], Plural:[{2: "WORTSTAMM"+"i"+tagSuffix("tōte"), 3: "WORTSTAMM"+tagInfix("u")+tagSuffix("ntō")}] }];
 var gKonjugation = [{Indikativ:[{Praesens:[{Aktiv:gKonjugationIndikativPraesensAktiv, Passiv:gKonjugationIndikativPraesensPassiv}],
								 Imperfekt:[{Aktiv:gKonjugationIndikativImperfektAktiv, Passiv:gKonjugationIndikativImperfektPassiv}],
								 Perfekt:[{Aktiv:gKonjugationIndikativPerfektAktiv, Passiv:gKonjugationIndikativPerfektPassiv}],
								 Plusquamperfekt:[{Aktiv:gKonjugationIndikativPlusquamperfektAktiv, Passiv:gKonjugationIndikativPlusquamperfektPassiv}],
								 Futu1:[{Aktiv:gKonjugationIndikativFuturIAktiv, Passiv:gKonjugationIndikativFuturIPassiv}],
								 Futu2:[{Aktiv:gKonjugationIndikativFuturIIAktiv, Passiv:gKonjugationIndikativFuturIIPassiv}]}
								], 
					  Konjunktiv:[{Praesens:[{Aktiv:gKonjugationKonjunktivPraesensAktiv, Passiv:gKonjugationKonjunktivPraesensPassiv}],
								  Imperfekt:[{Aktiv:gKonjugationKonjunktivImperfektAktiv, Passiv:gKonjugationKonjunktivImperfektPassiv}],
								  Perfekt:[{Aktiv:gKonjugationKonjunktivPerfektAktiv, Passiv:gKonjugationKonjunktivPerfektPassiv}],
								  Plusquamperfekt:[{Aktiv:gKonjugationKonjunktivPlusquamperfektAktiv, Passiv:gKonjugationKonjunktivPlusquamperfektPassiv}]}	  
					  ],
					  Imperativ:[{Impr1:[{Aktiv:gKonjugationImperativI}],
								  Impr2:[{Aktiv:gKonjugationImperativII}],
								 }  ],							  
					  }];
//neue Versionen, einfachere json files
  var emptyDeklination = {
    Singular: {
		Nominativ: "",
		Genitiv: "",
		Dativ: "",
		Akkusativ: "",
		Ablativ: ""
	},
	Plural: {
		Nominativ: "",
		Genitiv: "",
		Dativ: "",
		Akkusativ: "",
		Ablativ: ""
	}
 };
 //
 var nosingDeklination = {
    Singular: {
		Nominativ: "",
		Genitiv: "",
		Dativ: "",
		Akkusativ: "",
		Ablativ: ""
	}
 };
   var noplurDeklination = {
    Plural: {
		Nominativ: "",
		Genitiv: "",
		Dativ: "",
		Akkusativ: "",
		Ablativ: ""
	}
 };
  var aDeklination = {
    Singular: {
		Nominativ: "-"+tagSuffix("a"),
		Genitiv: "-"+tagSuffix("ae"),
		Dativ: "-"+tagSuffix("ae"),
		Akkusativ: "-"+tagSuffix("am"),
		Ablativ: "-"+tagSuffix("ā")
	},
    Plural: {
		Nominativ: "-"+tagSuffix("ae"),
		Genitiv: "-"+tagSuffix("ārum"),
		Dativ: "-"+tagSuffix("īs"),
		Akkusativ: "-"+tagSuffix("ās"),
		Ablativ: "-"+tagSuffix("īs")
	}
 };
  var aDeklination2 = JSON.parse(JSON.stringify(aDeklination));
  aDeklination2.Plural.Dativ = "-"+tagSuffix("abus");
  aDeklination2.Plural.Ablativ = "-"+tagSuffix("abus");
   var oDeklinationM = {
    Singular: {
		Nominativ: "-"+tagSuffix("us"),
		Genitiv: "-"+tagSuffix("ī"),
		Dativ: "-"+tagSuffix("ō"),
		Akkusativ: "-"+tagSuffix("um"),
		Ablativ: "-"+tagSuffix("ō")
	},
    Plural: {
		Nominativ: "-"+tagSuffix("ī"),
		Genitiv: "-"+tagSuffix("ōrum"),
		Dativ: "-"+tagSuffix("īs"),
		Akkusativ: "-"+tagSuffix("ōs"),
		Ablativ: "-"+tagSuffix("īs")
	}
 };
  var oDeklinationM_er_ri = {
    Singular: {
		Nominativ: "-er",
		Genitiv: "-r"+tagSuffix("ī"),
		Dativ: "-r"+tagSuffix("ō"),
		Akkusativ: "-r"+tagSuffix("um"),
		Ablativ: "-r"+tagSuffix("ō")
	},
    Plural: {
		Nominativ: "-r"+tagSuffix("ī"),
		Genitiv: "-r"+tagSuffix("ōrum"),
		Dativ: "-r"+tagSuffix("īs"),
		Akkusativ: "-r"+tagSuffix("ōs"),
		Ablativ: "-r"+tagSuffix("īs")
	}
 };
 var oDeklinationM_er_eri = {
    Singular: {
		Nominativ: "-er",
		Genitiv: "-er"+tagSuffix("ī"),
		Dativ: "-er"+tagSuffix("ō"),
		Akkusativ: "-er"+tagSuffix("um"),
		Ablativ: "-er"+tagSuffix("ō")
	},
    Plural: {
		Nominativ: "-er"+tagSuffix("ī"),
		Genitiv: "-er"+tagSuffix("ōrum"),
		Dativ: "-er"+tagSuffix("īs"),
		Akkusativ: "-er"+tagSuffix("ōs"),
		Ablativ: "-er"+tagSuffix("īs")
	}
 };
var oDeklinationM_i = {
    Singular: {
		Nominativ: "-",
		Genitiv: "-"+tagSuffix("ī"),
		Dativ: "-"+tagSuffix("ō"),
		Akkusativ: "-"+tagSuffix("um"),
		Ablativ: "-"+tagSuffix("ō")
	},
    Plural: {
		Nominativ: "-"+tagSuffix("ī"),
		Genitiv: "-"+tagSuffix("ōrum"),
		Dativ: "-"+tagSuffix("īs"),
		Akkusativ: "-"+tagSuffix("ōs"),
		Ablativ: "-"+tagSuffix("īs")
	}
 };
 var oDeklinationN = {
    Singular: {
		Nominativ: "-"+tagSuffix("um"),
		Genitiv: "-"+tagSuffix("ī"),
		Dativ: "-"+tagSuffix("ō"),
		Akkusativ: "-"+tagSuffix("um"),
		Ablativ: "-"+tagSuffix("ō")
	},
    Plural: {
		Nominativ: "-"+tagSuffix("a"),
		Genitiv: "-"+tagSuffix("ōrum"),
		Dativ: "-"+tagSuffix("īs"),
		Akkusativ: "-"+tagSuffix("a"),
		Ablativ: "-"+tagSuffix("īs")
	}
 };
var oDeklinationN_us = JSON.parse(JSON.stringify(oDeklinationN));
  oDeklinationN_us.Singular.Nominativ = "-"+tagSuffix("us");
  oDeklinationN_us.Singular.Akkusativ = "-"+tagSuffix("ī");
 var eDeklination = {
    Singular: {
		Nominativ: "-"+tagSuffix("ēs"),
		Genitiv: "-"+tagSuffix("eī"),
		Dativ: "-"+tagSuffix("eī"),
		Akkusativ: "-"+tagSuffix("em"),
		Ablativ: "-"+tagSuffix("ē")
	},
    Plural: {
		Nominativ: "-"+tagSuffix("ēs"),
		Genitiv: "-"+tagSuffix("ērum"),
		Dativ: "-"+tagSuffix("ēbus"),
		Akkusativ: "-"+tagSuffix("ēs"),
		Ablativ: "-"+tagSuffix("ēbus")
	}
 };
 var uDeklination = {
    Singular: {
		Nominativ: "-"+tagSuffix("us"),
		Genitiv: "-"+tagSuffix("ūs"),
		Dativ: "-"+tagSuffix("uī"),
		Akkusativ: "-"+tagSuffix("um"),
		Ablativ: "-"+tagSuffix("ū")
	},
    Plural: {
		Nominativ: "-"+tagSuffix("ūs"),
		Genitiv: "-"+tagSuffix("uum"),
		Dativ: "-"+tagSuffix("ibus"),
		Akkusativ: "-"+tagSuffix("ūs"),
		Ablativ: "-"+tagSuffix("ibus")
	}
 };
 var uDeklination_domus = JSON.parse(JSON.stringify(uDeklination));
  uDeklination_domus.Singular.Ablativ = "-"+tagSuffix("ō");
  uDeklination_domus.Plural.Genitiv = "-"+tagSuffix("ōrum");
  uDeklination_domus.Plural.Akkusativ = "-"+tagSuffix("ōs");
 var uDeklination_cornu = JSON.parse(JSON.stringify(uDeklination));
  uDeklination_cornu.Singular.Nominativ = "-"+tagSuffix("ū");
  uDeklination_cornu.Singular.Dativ = "-"+tagSuffix("ū");
  uDeklination_cornu.Singular.Akkusativ = "-"+tagSuffix("ū");
  uDeklination_cornu.Plural.Nominativ = "-"+tagSuffix("ua");
  uDeklination_cornu.Plural.Akkusativ = "-"+tagSuffix("ua");
 var iDeklinationMF = {
    Singular: {
		Nominativ: "-"+tagSuffix("is"),
		Genitiv: "-"+tagSuffix("is"),
		Dativ: "-"+tagSuffix("ī"),
		Akkusativ: "-"+tagSuffix("im"),
		Ablativ: "-"+tagSuffix("ī")
	},
    Plural: {
		Nominativ: "-"+tagSuffix("ēs"),
		Genitiv: "-"+tagSuffix("ium"),
		Dativ: "-"+tagSuffix("ibus"),
		Akkusativ: "-"+tagSuffix("ēs"),
		Ablativ: "-"+tagSuffix("ibus")
	}
 };
var iDeklinationN = {
    Singular: {
		Nominativ: "*",
		Genitiv: "-"+tagSuffix("is"),
		Dativ: "-"+tagSuffix("ī"),
		Akkusativ: "*",
		Ablativ: "-"+tagSuffix("ī")
	},
    Plural: {
		Nominativ: "-"+tagSuffix("ia"),
		Genitiv: "-"+tagSuffix("ium"),
		Dativ: "-"+tagSuffix("ibus"),
		Akkusativ: "-"+tagSuffix("ia"),
		Ablativ: "-"+tagSuffix("ibus")
	}
 };
  var iDeklinationN_e_is = JSON.parse(JSON.stringify(iDeklinationN));
  iDeklinationN_e_is.Singular.Nominativ = "-e";
  iDeklinationN_e_is.Singular.Akkusativ = "-e"  ;
var iDeklinationAdj3eM = {
    Singular: {
		Nominativ: "-"+tagSuffix(""),
		Genitiv: "-"+tagSuffix("is"),
		Dativ: "-"+tagSuffix("ī"),
		Akkusativ: "-"+tagSuffix("em"),
		Ablativ: "-"+tagSuffix("ī")
	},
    Plural: {
		Nominativ: "-"+tagSuffix("ēs"),
		Genitiv: "-"+tagSuffix("ium"),
		Dativ: "-"+tagSuffix("ibus"),
		Akkusativ: "-"+tagSuffix("ēs"),
		Ablativ: "-"+tagSuffix("ibus")
	}
 };
  var iDeklinationAdj3eF = JSON.parse(JSON.stringify(iDeklinationAdj3eM));
  iDeklinationAdj3eF.Singular.Nominativ = "-"+tagSuffix("is")
  var iDeklinationAdj3eN = JSON.parse(JSON.stringify(iDeklinationAdj3eM));
  iDeklinationAdj3eN.Singular.Nominativ = "-"+tagSuffix("e")
  iDeklinationAdj3eN.Singular.Akkusativ = "-"+tagSuffix("e") 
  iDeklinationAdj3eN.Plural.Nominativ = "-"+tagSuffix("ia") 
  iDeklinationAdj3eN.Plural.Akkusativ = "-"+tagSuffix("ia") 
var iDeklinationAdj2eMF = {
    Singular: {
		Nominativ: "-"+tagSuffix("is"),
		Genitiv: "-"+tagSuffix("is"),
		Dativ: "-"+tagSuffix("ī"),
		Akkusativ: "-"+tagSuffix("em"),
		Ablativ: "-"+tagSuffix("ī")
	},
    Plural: {
		Nominativ: "-"+tagSuffix("ēs"),
		Genitiv: "-"+tagSuffix("ium"),
		Dativ: "-"+tagSuffix("ibus"),
		Akkusativ: "-"+tagSuffix("ēs"),
		Ablativ: "-"+tagSuffix("ibus")
	}
 };
  var iDeklinationAdj2eN = JSON.parse(JSON.stringify(iDeklinationAdj2eMF));
  iDeklinationAdj2eN.Singular.Nominativ = "-"+tagSuffix("e")
  iDeklinationAdj2eN.Singular.Akkusativ = "-"+tagSuffix("e") 
  iDeklinationAdj2eN.Plural.Nominativ = "-"+tagSuffix("ia") 
  iDeklinationAdj2eN.Plural.Akkusativ = "-"+tagSuffix("ia")
 var iDeklinationAdj1eMF = {
    Singular: {
		Nominativ: "-"+tagSuffix("ns"),
		Genitiv: "-"+tagSuffix("is"),
		Dativ: "-"+tagSuffix("ī"),
		Akkusativ: "-"+tagSuffix("em"),
		Ablativ: "-"+tagSuffix("ī")
	},
    Plural: {
		Nominativ: "-"+tagSuffix("ēs"),
		Genitiv: "-"+tagSuffix("ium"),
		Dativ: "-"+tagSuffix("ibus"),
		Akkusativ: "-"+tagSuffix("ēs"),
		Ablativ: "-"+tagSuffix("ibus")
	}
 };
  var iDeklinationAdj1eN = JSON.parse(JSON.stringify(iDeklinationAdj1eMF));
  iDeklinationAdj1eN.Singular.Akkusativ = "-ns" 
  iDeklinationAdj1eN.Plural.Nominativ = "-nt"+tagSuffix("ia") 
  iDeklinationAdj1eN.Plural.Akkusativ = "-nt"+tagSuffix("ia") 
 var iDeklinationAdj1eMF2 = {
    Singular: {
		Nominativ: "-"+tagSuffix("x"),
		Genitiv: "-"+tagSuffix("is"),
		Dativ: "-"+tagSuffix("ī"),
		Akkusativ: "-"+tagSuffix("em"),
		Ablativ: "-"+tagSuffix("ī")
	},
    Plural: {
		Nominativ: "-"+tagSuffix("ēs"),
		Genitiv: "-"+tagSuffix("ium"),
		Dativ: "-"+tagSuffix("ibus"),
		Akkusativ: "-"+tagSuffix("ēs"),
		Ablativ: "-"+tagSuffix("ibus")
	}
 };
  var iDeklinationAdj1eN2 = JSON.parse(JSON.stringify(iDeklinationAdj1eMF));
  iDeklinationAdj1eN2.Singular.Akkusativ = "-x" ;
  iDeklinationAdj1eN2.Plural.Nominativ = "-c"+tagSuffix("ia") ;
  iDeklinationAdj1eN2.Plural.Akkusativ = "-c"+tagSuffix("ia") ;
 var kDeklinationAdjMF = {
    Singular: {
		Nominativ: tagSuffix("*"),
		Genitiv: "-"+tagSuffix("is"),
		Dativ: "-"+tagSuffix("ī"),
		Akkusativ: "-"+tagSuffix("em"),
		Ablativ: "-"+tagSuffix("e")
	},
    Plural: {
		Nominativ: "-"+tagSuffix("ēs"),
		Genitiv: "-"+tagSuffix("um"),
		Dativ: "-"+tagSuffix("ibus"),
		Akkusativ: "-"+tagSuffix("ēs"),
		Ablativ: "-"+tagSuffix("ibus")
	}
 };
  var kDeklinationAdjN = JSON.parse(JSON.stringify(kDeklinationAdjMF));
  kDeklinationAdjN.Singular.Akkusativ = "*" 
  kDeklinationAdjN.Plural.Nominativ = "-"+tagSuffix("a") 
  kDeklinationAdjN.Plural.Akkusativ = "-"+tagSuffix("a") 
 var kDeklinationM = {
    Singular: {
		Nominativ: "-"+tagSuffix(""),
		Genitiv: "-"+tagSuffix("is"),
		Dativ: "-"+tagSuffix("ī"),
		Akkusativ: "-"+tagSuffix("em"),
		Ablativ: "-"+tagSuffix("e")
	},
    Plural: {
		Nominativ: "-"+tagSuffix("ēs"),
		Genitiv: "-"+tagSuffix("um"),
		Dativ: "-"+tagSuffix("ibus"),
		Akkusativ: "-"+tagSuffix("ēs"),
		Ablativ: "-"+tagSuffix("ibus")
	}
 };
   var kDeklinationM_es_itis = {
    Singular: {
		Nominativ: "-es",
		Genitiv: "-it"+tagSuffix("is"),
		Dativ: "-it"+tagSuffix("ī"),
		Akkusativ: "-it"+tagSuffix("em"),
		Ablativ: "-it"+tagSuffix("e") },
    Plural: {
		Nominativ: "-it"+tagSuffix("ēs"),
		Genitiv: "-it"+tagSuffix("um"),
		Dativ: "-it"+tagSuffix("ibus"),
		Akkusativ: "-it"+tagSuffix("ēs"),
		Ablativ: "-it"+tagSuffix("ibus") }
 };
  ////var kDeklinationM_er_risV2 = JSON.parse(JSON.stringify(iDeklinationAdj1eMFV2));
  ////kDeklinationM_er_risV2.Singular.Akkusativ = "x" ;
   var kDeklinationM_er_ris = {
    Singular: {
		Nominativ: "-er",
		Genitiv: "-r"+tagSuffix("is"),
		Dativ: "-r"+tagSuffix("ī"),
		Akkusativ: "-r"+tagSuffix("em"),
		Ablativ: "-r"+tagSuffix("e") },
    Plural: {
		Nominativ: "-r"+tagSuffix("ēs"),
		Genitiv: "-r"+tagSuffix("um"),
		Dativ: "-r"+tagSuffix("ibus"),
		Akkusativ: "-r"+tagSuffix("ēs"),
		Ablativ: "-r"+tagSuffix("ibus") }
 };
   var kDeklinationM_os_oris = {
    Singular: {
		Nominativ: "-os",
		Genitiv: "-or"+tagSuffix("is"),
		Dativ: "-or"+tagSuffix("ī"),
		Akkusativ: "-or"+tagSuffix("em"),
		Ablativ: "-or"+tagSuffix("e") },
    Plural: {
		Nominativ: "-or"+tagSuffix("ēs"),
		Genitiv: "-or"+tagSuffix("um"),
		Dativ: "-or"+tagSuffix("ibus"),
		Akkusativ: "-or"+tagSuffix("ēs"),
		Ablativ: "-or"+tagSuffix("ibus") }
 };
   var kDeklinationF_o_onis = {
    Singular: {
		Nominativ: "-ō",
		Genitiv: "-on"+tagSuffix("is"),
		Dativ: "-on"+tagSuffix("ī"),
		Akkusativ: "-on"+tagSuffix("em"),
		Ablativ: "-on"+tagSuffix("e") },
    Plural: {
		Nominativ: "-on"+tagSuffix("ēs"),
		Genitiv: "-on"+tagSuffix("um"),
		Dativ: "-on"+tagSuffix("ibus"),
		Akkusativ: "-on"+tagSuffix("ēs"),
		Ablativ: "-on"+tagSuffix("ibus") }
 };
   var kDeklinationF_o_inis = {
    Singular: {
		Nominativ: "-ō",
		Genitiv: "-in"+tagSuffix("is"),
		Dativ: "-in"+tagSuffix("ī"),
		Akkusativ: "-in"+tagSuffix("em"),
		Ablativ: "-in"+tagSuffix("e") },
    Plural: {
		Nominativ: "-in"+tagSuffix("ēs"),
		Genitiv: "-in"+tagSuffix("um"),
		Dativ: "-in"+tagSuffix("ibus"),
		Akkusativ: "-in"+tagSuffix("ēs"),
		Ablativ: "-in"+tagSuffix("ibus") }
 };
   var kDeklinationF_as_atis = {
    Singular: {
		Nominativ: "-ās",
		Genitiv: "-āt"+tagSuffix("is"),
		Dativ: "-āt"+tagSuffix("ī"),
		Akkusativ: "-āt"+tagSuffix("em"),
		Ablativ: "-āt"+tagSuffix("e") },
    Plural: {
		Nominativ: "-āt"+tagSuffix("ēs"),
		Genitiv: "-āt"+tagSuffix("um"),
		Dativ: "-āt"+tagSuffix("ibus"),
		Akkusativ: "-āt"+tagSuffix("ēs"),
		Ablativ: "-āt"+tagSuffix("ibus") }
 };
   var kDeklinationF_us_utis = {
    Singular: {
		Nominativ: "-us",
		Genitiv: "-ut"+tagSuffix("is"),
		Dativ: "-ut"+tagSuffix("ī"),
		Akkusativ: "-ut"+tagSuffix("em"),
		Ablativ: "-ut"+tagSuffix("e") },
    Plural: {
		Nominativ: "-ut"+tagSuffix("ēs"),
		Genitiv: "-ut"+tagSuffix("um"),
		Dativ: "-ut"+tagSuffix("ibus"),
		Akkusativ: "-ut"+tagSuffix("ēs"),
		Ablativ: "-ut"+tagSuffix("ibus") }
 };
   var kDeklinationF_x_cis = {
    Singular: {
		Nominativ: "-x",
		Genitiv: "-c"+tagSuffix("is"),
		Dativ: "-c"+tagSuffix("ī"),
		Akkusativ: "-c"+tagSuffix("em"),
		Ablativ: "-c"+tagSuffix("e") },
    Plural: {
		Nominativ: "-c"+tagSuffix("ēs"),
		Genitiv: "-c"+tagSuffix("um"),
		Dativ: "-c"+tagSuffix("ibus"),
		Akkusativ: "-c"+tagSuffix("ēs"),
		Ablativ: "-c"+tagSuffix("ibus") }
 };
   var kDeklinationF_x_gis = {
    Singular: {
		Nominativ: "-x",
		Genitiv: "-g"+tagSuffix("is"),
		Dativ: "-g"+tagSuffix("ī"),
		Akkusativ: "-g"+tagSuffix("em"),
		Ablativ: "-g"+tagSuffix("e") },
    Plural: {
		Nominativ: "-g"+tagSuffix("ēs"),
		Genitiv: "-g"+tagSuffix("um"),
		Dativ: "-g"+tagSuffix("ibus"),
		Akkusativ: "-g"+tagSuffix("ēs"),
		Ablativ: "-g"+tagSuffix("ibus") }
 };
   var kDeklinationN_us_eris = {
    Singular: {
		Nominativ: "-us",
		Genitiv: "-er"+tagSuffix("is"),
		Dativ: "-er"+tagSuffix("ī"),
		Akkusativ: "-us",
		Ablativ: "-er"+tagSuffix("e") },
    Plural: {
		Nominativ: "-er"+tagSuffix("a"),
		Genitiv: "-er"+tagSuffix("um"),
		Dativ: "-er"+tagSuffix("ibus"),
		Akkusativ: "-er"+tagSuffix("a"),
		Ablativ: "-er"+tagSuffix("ibus") }
 };
   var kDeklinationN_us_oris = {
    Singular: {
		Nominativ: "-us",
		Genitiv: "-or"+tagSuffix("is"),
		Dativ: "-or"+tagSuffix("ī"),
		Akkusativ: "-us",
		Ablativ: "-or"+tagSuffix("e") },
    Plural: {
		Nominativ: "-or"+tagSuffix("a"),
		Genitiv: "-or"+tagSuffix("um"),
		Dativ: "-or"+tagSuffix("ibus"),
		Akkusativ: "-or"+tagSuffix("a"),
		Ablativ: "-or"+tagSuffix("ibus") }
 };
   var kDeklinationN_men_minis = {
    Singular: {
		Nominativ: "-men",
		Genitiv: "-min"+tagSuffix("is"),
		Dativ: "-min"+tagSuffix("i"), //korrigiert
		Akkusativ: "-men",
		Ablativ: "-min"+tagSuffix("e") },
    Plural: {
		Nominativ: "-min"+tagSuffix("a"),
		Genitiv: "-min"+tagSuffix("um"),
		Dativ: "-min"+tagSuffix("ibus"),
		Akkusativ: "-min"+tagSuffix("a"),
		Ablativ: "-min"+tagSuffix("ibus") }
 };
   var gDeklination = {
    Singular: {
		Nominativ: "-"+tagSuffix("is"),
		Genitiv: "-"+tagSuffix("is"),
		Dativ: "-"+tagSuffix("ī"),
		Akkusativ: "-"+tagSuffix("em"),
		Ablativ: "-"+tagSuffix("e") },
    Plural: {
		Nominativ: "-"+tagSuffix("ēs"),
		Genitiv: "-"+tagSuffix("ium"),
		Dativ: "-"+tagSuffix("ibus"),
		Akkusativ: "-"+tagSuffix("ēs"),
		Ablativ: "-"+tagSuffix("ibus") }
 };
   var gDeklination_s_is = {
    Singular: {
		Nominativ: "-"+tagSuffix("s"),
		Genitiv: "-"+tagSuffix("is"),
		Dativ: "-"+tagSuffix("ī"),
		Akkusativ: "-"+tagSuffix("em"),
		Ablativ: "-"+tagSuffix("e") },
    Plural: {
		Nominativ: "-"+tagSuffix("ēs"),
		Genitiv: "-"+tagSuffix("ium"),
		Dativ: "-"+tagSuffix("ibus"),
		Akkusativ: "-"+tagSuffix("ēs"),
		Ablativ: "-"+tagSuffix("ibus") }
 };
  
 var aoAdjDeklination = { M: oDeklinationM, F: aDeklination, N: oDeklinationN} //magnus, -a, -um
 var iDeklinationAdj2 = { M: iDeklinationAdj2eMF, F: iDeklinationAdj2eMF, N: iDeklinationAdj2eN}
 var iDeklinationAdj3 = { M:  iDeklinationAdj3eM, F:  iDeklinationAdj3eF, N:  iDeklinationAdj3eN}
 var iDeklinationAdj1 = { M: iDeklinationAdj1eMF, F: iDeklinationAdj1eMF, N: iDeklinationAdj1eN}
 var iDeklinationAdj1V2 = { M: iDeklinationAdj1eMF2, F: iDeklinationAdj1eMF2, N: iDeklinationAdj1eN2}
 var kDeklinationAdj = { M: kDeklinationAdjMF, F: kDeklinationAdjMF, N: kDeklinationAdjN}

 var quisquaquidDeklination = { 
  M: {
    Singular: {
		Nominativ: "quis",
		Genitiv: "cuius",
		Dativ: "cui",
		Akkusativ: "quem",
		Ablativ: "quō"
	},
    Plural: {
		Nominativ: "quī",
		Genitiv: "	quōrum",
		Dativ: "quibus",
		Akkusativ: "quōs",
		Ablativ: "quibus"
	}
  }, 
  F: {
    Singular: {
		Nominativ: "qua",
		Genitiv: "cuius",
		Dativ: "cui",
		Akkusativ: "quam",
		Ablativ: "quā"
	},
    Plural: {
		Nominativ: "quae",
		Genitiv: "	quārum",
		Dativ: "quibus",
		Akkusativ: "quās",
		Ablativ: "quibus"
	}
  }, 
  N: {
    Singular: {
		Nominativ: "quid",
		Genitiv: "cuius",
		Dativ: "cui",
		Akkusativ: "quid",
		Ablativ: "quō"
	},
    Plural: {
		Nominativ: "quae",
		Genitiv: "	quōrum",
		Dativ: "quibus",
		Akkusativ: "quae",
		Ablativ: "quibus"
	}
  }
}
var quisquidDeklination = { 
  M: {
    Singular: {
		Nominativ: "quis",
		Genitiv: "cuius",
		Dativ: "cui",
		Akkusativ: "quem",
		Ablativ: "quō"
	},
    Plural: {
		Nominativ: "",
		Genitiv: "",
		Dativ: "",
		Akkusativ: "",
		Ablativ: ""
	}
  }, 
  F: {
    Singular: {
		Nominativ: "",
		Genitiv: "",
		Dativ: "",
		Akkusativ: "",
		Ablativ: ""
	},
    Plural: {
		Nominativ: "",
		Genitiv: "",
		Dativ: "",
		Akkusativ: "",
		Ablativ: ""
	}
  }, 
  N: {
    Singular: {
		Nominativ: "quid",
		Genitiv: "cuius",
		Dativ: "cui",
		Akkusativ: "quid",
		Ablativ: "quō"
	},
    Plural: {
		Nominativ: "",
		Genitiv: "",
		Dativ: "",
		Akkusativ: "",
		Ablativ: ""
	}
  }
}
var quiquaequodDeklination = [
  { 
  M: [{
    Singular: [{
		Nominativ: "qu"+tagSuffix("ī"),
		Genitiv: "cu"+tagSuffix("ius"),
		Dativ: "cu"+tagSuffix("i"),
		Akkusativ: "qu"+tagSuffix("em"),
		Ablativ: "qu"+tagSuffix("ō")
	}],
    Plural: [{
		Nominativ: "qu"+tagSuffix("ī"),
		Genitiv: "qu"+tagSuffix("ōrum"),
		Dativ: "qu"+tagSuffix("ibus"),
		Akkusativ: "qu"+tagSuffix("ōs"),
		Ablativ: "qu"+tagSuffix("ibus")
	}]
  }], 
  F: [{
    Singular: [{
		Nominativ: "qu"+tagSuffix("ae"),
		Genitiv: "cu"+tagSuffix("ius"),
		Dativ: "cu"+tagSuffix("i"),
		Akkusativ: "qu"+tagSuffix("am"),
		Ablativ: "qu"+tagSuffix("ā")
	}],
    Plural: [{
		Nominativ: "qu"+tagSuffix("ae"),
		Genitiv: "qu"+tagSuffix("ārum"),
		Dativ: "qu"+tagSuffix("ibus"),
		Akkusativ: "qu"+tagSuffix("ās"),
		Ablativ: "qu"+tagSuffix("ibus")
	}]
  }], 
  N: [{
    Singular: [{
		Nominativ: "qu"+tagSuffix("od"),
		Genitiv: "cu"+tagSuffix("ius"),
		Dativ: "cu"+tagSuffix("i"),
		Akkusativ: "qu"+tagSuffix("od"),
		Ablativ: "qu"+tagSuffix("ō")
	}],
    Plural: [{
		Nominativ: "qu"+tagSuffix("ae"),
		Genitiv: "qu"+tagSuffix("ōrum"),
		Dativ: "qu"+tagSuffix("ibus"),
		Akkusativ: "qu"+tagSuffix("ae"),
		Ablativ: "qu"+tagSuffix("ibus")
	}]
  }]
  }
 ]
var quiquaequodDeklinationDe = [
  { 
  M: [{
    Singular: [{
		Nominativ: "der",
		Genitiv: "dessen",
		Dativ: "dem",
		Akkusativ: "den",
		Ablativ: "z.B. durch den"
	}]
  },
  {
    Plural: [{
		Nominativ: "die",
		Genitiv: "deren",
		Dativ: "denen",
		Akkusativ: "die",
		Ablativ: "z.B. durch die"
	}]
  }], 
  F: [{
    Singular: [{
		Nominativ: "die",
		Genitiv: "deren",
		Dativ: "der",
		Akkusativ: "die",
		Ablativ: "z.B. durch die"
	}]
  },
  {
    Plural: [{
		Nominativ: "die",
		Genitiv: "deren",
		Dativ: "denen",
		Akkusativ: "die",
		Ablativ: "z.B. durch die"
	}]
  }], 
  N: [{
    Singular: [{
		Nominativ: "das",
		Genitiv: "dessen",
		Dativ: "dem",
		Akkusativ: "das",
		Ablativ: "wodurch"
	}]
  },
  {
    Plural: [{
		Nominativ: "die",
		Genitiv: "deren",
		Dativ: "denen",
		Akkusativ: "die",
		Ablativ: "z.B. durch die"
	}]
  }]
  }
 ]
var iseaidDeklination = [
  { 
  M: [{
    Singular: [{
		Nominativ: "i"+tagSuffix("s"),
		Genitiv: "e"+tagSuffix("ius"),
		Dativ: "e"+tagSuffix("i"),
		Akkusativ: "e"+tagSuffix("um"),
		Ablativ: "e"+tagSuffix("o")
	}],
    Plural: [{
		Nominativ: "e"+tagSuffix("i") + tagAlt("i"+tagSuffix("i")),
		Genitiv: "e"+tagSuffix("orum"),
		Dativ: "e"+tagSuffix("is") + tagAlt("i"+tagSuffix("is")),
		Akkusativ: "e"+tagSuffix("os"),
		Ablativ: "e"+tagSuffix("is") + tagAlt("i"+tagSuffix("is"))
	}]
  }], 
  F: [{
    Singular: [{
		Nominativ: "e"+tagSuffix("a"),
		Genitiv: "e"+tagSuffix("ius"),
		Dativ: "e"+tagSuffix("i"),
		Akkusativ: "e"+tagSuffix("am"),
		Ablativ: "e"+tagSuffix("a")
	}],
    Plural: [{
		Nominativ: "e"+tagSuffix("ae"),
		Genitiv: "e"+tagSuffix("arum"),
		Dativ: "e"+tagSuffix("is") + tagAlt("i"+tagSuffix("is")),
		Akkusativ: "e"+tagSuffix("as"),
		Ablativ: "e"+tagSuffix("is") + tagAlt("i"+tagSuffix("is"))
	}]
  }], 
  N: [{
    Singular: [{
		Nominativ: "i"+tagSuffix("d"),
		Genitiv: "e"+tagSuffix("ius"),
		Dativ: "e"+tagSuffix("i"),
		Akkusativ: "i"+tagSuffix("d"),
		Ablativ: "e"+tagSuffix("o")
	}],
    Plural: [{
		Nominativ: "e"+tagSuffix("a"),
		Genitiv: "e"+tagSuffix("orum"),
		Dativ: "e"+tagSuffix("is") + tagAlt("i"+tagSuffix("is")),
		Akkusativ: "e"+tagSuffix("a"),
		Ablativ: "e"+tagSuffix("is") + tagAlt("i"+tagSuffix("is"))
	}]
  }]
  }
 ]
 var hichaechocDeklination = [
  { 
  M: [{
    Singular: [{
		Nominativ: "hic",
		Genitiv: "huius",
		Dativ: "huīc",
		Akkusativ: "hunc",
		Ablativ: "hōc"
	}],
    Plural: [{
		Nominativ: "hī",
		Genitiv: "horūm",
		Dativ: "hīs",
		Akkusativ: "hōs",
		Ablativ: "hīs"
	}]
  }], 
  F: [{
    Singular: [{
		Nominativ: "haec",
		Genitiv: "huius",
		Dativ: "huīc",
		Akkusativ: "hanc",
		Ablativ: "hāc"
	}],
    Plural: [{
		Nominativ: "hae",
		Genitiv: "hārum",
		Dativ: "hīs",
		Akkusativ: "has",
		Ablativ: "hīs"
	}]
  }], 
  N: [{
    Singular: [{
		Nominativ: "hoc",
		Genitiv: "huius",
		Dativ: "huīc",
		Akkusativ: "hoc",
		Ablativ: "hoc"
	}],
    Plural: [{
		Nominativ: "haec",
		Genitiv: "hōrum",
		Dativ: "hīs",
		Akkusativ: "haec",
		Ablativ: "hīs"
	}]
  }]
  }
 ]
 var egomeimihiDeklination = [
  { 
  1: [{
    Singular: [{
		Nominativ: "ego",
		Genitiv: "meī",
		Dativ: "mihi",
		Akkusativ: "mē",
		Ablativ: "(ā) mē, mecum"
	}],
    Plural: [{
		Nominativ: "nōs",
		Genitiv: "nostrī/nostrum",
		Dativ: "nōbīs",
		Akkusativ: "nōs",
		Ablativ: "(ā) nōbīs, nobiscum"
	}]
  }], 
  2: [{
    Singular: [{
		Nominativ: "tū",
		Genitiv: "tuī",
		Dativ: "tibi",
		Akkusativ: "tē",
		Ablativ: "(ā) tē, tecum"
	}],
    Plural: [{
		Nominativ: "vōs",
		Genitiv: "vestrī/vestrum",
		Dativ: "vōbīs",
		Akkusativ: "vōs",
		Ablativ: "(ā) vōbīs, vobiscum"
	}]
  }], 
  3: [{
    Singular: [{
		Nominativ: "- (is,ea,id)",
		Genitiv: "suī",
		Dativ: "sibi",
		Akkusativ: "sē",
		Ablativ: "(ā) sē, secum"
	}],
    Plural: [{
		Nominativ: "- (ii,eae,ea)",
		Genitiv: "suī",
		Dativ: "sibi",
		Akkusativ: "sē",
		Ablativ: "(ā) sē, secum"
	}]
  }]
  }
 ]
var PPADeklination = [{ 
  M: [{
    Singular: [{
		Nominativ: "PRAESENS"+"BINDUNG"+tagSuffix("ns"),
		Genitiv: "PRAESENS"+"BINDUNG"+tagSuffix("ntis"),
		Dativ: "PRAESENS"+"BINDUNG"+tagSuffix("nti"),
		Akkusativ: "PRAESENS"+"BINDUNG"+tagSuffix("ntem"),
		Ablativ: "PRAESENS"+"BINDUNG"+tagSuffix("nte"),
	}],
    Plural: [{
		Nominativ: "PRAESENS"+"BINDUNG"+tagSuffix("ntes"),
		Genitiv: "PRAESENS"+"BINDUNG"+tagSuffix("ntium"),
		Dativ: "PRAESENS"+"BINDUNG"+tagSuffix("ntibus"),
		Akkusativ: "PRAESENS"+"BINDUNG"+tagSuffix("ntes"),
		Ablativ: "PRAESENS"+"BINDUNG"+tagSuffix("ntibus"),
	}]
  }], 
  F: [{
    Singular: [{
		Nominativ: "PRAESENS"+"BINDUNG"+tagSuffix("ns"),
		Genitiv: "PRAESENS"+"BINDUNG"+tagSuffix("ntis"),
		Dativ: "PRAESENS"+"BINDUNG"+tagSuffix("nti"),
		Akkusativ: "PRAESENS"+"BINDUNG"+tagSuffix("ntem"),
		Ablativ: "PRAESENS"+"BINDUNG"+tagSuffix("nte"),
	}],
    Plural: [{
		Nominativ: "PRAESENS"+"BINDUNG"+tagSuffix("ntes"),
		Genitiv: "PRAESENS"+"BINDUNG"+tagSuffix("ntium"),
		Dativ: "PRAESENS"+"BINDUNG"+tagSuffix("ntibus"),
		Akkusativ: "PRAESENS"+"BINDUNG"+tagSuffix("ntes"),
		Ablativ: "PRAESENS"+"BINDUNG"+tagSuffix("ntibus"),
	}]
  }], 
  N: [{
    Singular: [{
		Nominativ: "PRAESENS"+"BINDUNG"+tagSuffix("ns"),
		Genitiv: "PRAESENS"+"BINDUNG"+tagSuffix("ntis"),
		Dativ: "PRAESENS"+"BINDUNG"+tagSuffix("nti"),
		Akkusativ: "PRAESENS"+"BINDUNG"+tagSuffix("ns"),
		Ablativ: "PRAESENS"+"BINDUNG"+tagSuffix("nte"),
	}],
    Plural: [{
		Nominativ: "PRAESENS"+"BINDUNG"+tagSuffix("ntia"),
		Genitiv: "PRAESENS"+"BINDUNG"+tagSuffix("ntium"),
		Dativ: "PRAESENS"+"BINDUNG"+tagSuffix("ntibus"),
		Akkusativ: "PRAESENS"+"BINDUNG"+tagSuffix("ntia"),
		Ablativ: "PRAESENS"+"BINDUNG"+tagSuffix("ntibus"),
	}]
  }]
}]
var PPPDeklination = [{ 
  M: [{
    Singular: [{
		Nominativ: "PPP\\1"+tagSuffix("PPP\\2us"),
		Genitiv: "PPP\\1"+tagSuffix("PPP\\2i"),
		Dativ: "PPP\\1"+tagSuffix("PPP\\2o"),
		Akkusativ: "PPP\\1"+tagSuffix("PPP\\2um"),
		Ablativ: "PPP\\1"+tagSuffix("PPP\\2o"),
	}],
    Plural: [{
		Nominativ: "PPP\\1"+tagSuffix("PPP\\2i"),
		Genitiv: "PPP\\1"+tagSuffix("PPP\\2orum"),
		Dativ: "PPP\\1"+tagSuffix("PPP\\2is"),
		Akkusativ: "PPP\\1"+tagSuffix("PPP\\2os"),
		Ablativ: "PPP\\1"+tagSuffix("PPP\\2is"),
	}]
  }], 
  F: [{
    Singular: [{
		Nominativ: "PPP\\1"+tagSuffix("PPP\\2a"),
		Genitiv: "PPP\\1"+tagSuffix("PPP\\2ae"),
		Dativ: "PPP\\1"+tagSuffix("PPP\\2ae"),
		Akkusativ: "PPP\\1"+tagSuffix("PPP\\2am"),
		Ablativ: "PPP\\1"+tagSuffix("PPP\\2a"),
	}],
    Plural: [{
		Nominativ: "PPP\\1"+tagSuffix("PPP\\2ae"),
		Genitiv: "PPP\\1"+tagSuffix("PPP\\2arum"),
		Dativ: "PPP\\1"+tagSuffix("PPP\\2is"),
		Akkusativ: "PPP\\1"+tagSuffix("PPP\\2as"),
		Ablativ: "PPP\\1"+tagSuffix("PPP\\2is"),
	}]
  }], 
  N: [{
    Singular: [{
		Nominativ: "PPP\\1"+tagSuffix("PPP\\2um"),
		Genitiv: "PPP\\1"+tagSuffix("PPP\\2i"),
		Dativ: "PPP\\1"+tagSuffix("PPP\\2o"),
		Akkusativ: "PPP\\1"+tagSuffix("PPP\\2um"),
		Ablativ: "PPP\\1"+tagSuffix("PPP\\2o"),
	}],
    Plural: [{
		Nominativ: "PPP\\1"+tagSuffix("PPP\\2a"),
		Genitiv: "PPP\\1"+tagSuffix("PPP\\2orum"),
		Dativ: "PPP\\1"+tagSuffix("PPP\\2is"),
		Akkusativ: "PPP\\1"+tagSuffix("PPP\\2a"),
		Ablativ: "PPP\\1"+tagSuffix("PPP\\2is"),
	}]
  }]
}]
var noPartDeklination = [{ 
  M: [{
    Singular: [{
		Nominativ: "",
		Genitiv: "",
		Dativ: "",
		Akkusativ: "",
		Ablativ: "",
	}],
    Plural: [{
		Nominativ: "",
		Genitiv: "",
		Dativ: "",
		Akkusativ: "",
		Ablativ: "",
	}]
  }], 
  F: [{
    Singular: [{
		Nominativ: "",
		Genitiv: "",
		Dativ: "",
		Akkusativ: "",
		Ablativ: "",
	}],
    Plural: [{
		Nominativ: "",
		Genitiv: "",
		Dativ: "",
		Akkusativ: "",
		Ablativ: "",
	}]
  }], 
  N: [{
    Singular: [{
		Nominativ: "",
		Genitiv: "",
		Dativ: "",
		Akkusativ: "",
		Ablativ: "",
	}],
    Plural: [{
		Nominativ: "",
		Genitiv: "",
		Dativ: "",
		Akkusativ: "",
		Ablativ: "",
	}]
  }]
}]
var PFADeklination = [{ 
  M: [{
    Singular: [{
		Nominativ: "PFA\\1"+tagSuffix("PFA\\2ūrus"),
		Genitiv: "PFA\\1"+tagSuffix("PFA\\2ūri"),
		Dativ: "PFA\\1"+tagSuffix("PFA\\2ūro"),
		Akkusativ: "PFA\\1"+tagSuffix("PFA\\2ūrum"),
		Ablativ: "PFA\\1"+tagSuffix("PFA\\2ūro"),
	}],
    Plural: [{
		Nominativ: "PFA\\1"+tagSuffix("PFA\\2ūri"),
		Genitiv: "PFA\\1"+tagSuffix("PFA\\2ūrorum"),
		Dativ: "PFA\\1"+tagSuffix("PFA\\2ūris"),
		Akkusativ: "PFA\\1"+tagSuffix("PFA\\2ūros"),
		Ablativ: "PFA\\1"+tagSuffix("PFA\\2ūris"),
	}]
  }], 
  F: [{
    Singular: [{
		Nominativ: "PFA\\1"+tagSuffix("PFA\\2ūra"),
		Genitiv: "PFA\\1"+tagSuffix("PFA\\2ūrae"),
		Dativ: "PFA\\1"+tagSuffix("PFA\\2ūrae"),
		Akkusativ: "PFA\\1"+tagSuffix("PFA\\2ūram"),
		Ablativ: "PFA\\1"+tagSuffix("PFA\\2ūra"),
	}],
    Plural: [{
		Nominativ: "PFA\\1"+tagSuffix("PFA\\2ūrae"),
		Genitiv: "PFA\\1"+tagSuffix("PFA\\2ūrarum"),
		Dativ: "PFA\\1"+tagSuffix("PFA\\2ūris"),
		Akkusativ: "PFA\\1"+tagSuffix("PFA\\2ūras"),
		Ablativ: "PFA\\1"+tagSuffix("PFA\\2ūris"),
	}]
  }], 
  N: [{
    Singular: [{
		Nominativ: "PFA\\1"+tagSuffix("PFA\\2ūrum"),
		Genitiv: "PFA\\1"+tagSuffix("PFA\\2ūri"),
		Dativ: "PFA\\1"+tagSuffix("PFA\\2ūro"),
		Akkusativ: "PFA\\1"+tagSuffix("PFA\\2ūrum"),
		Ablativ: "PFA\\1"+tagSuffix("PFA\\2ūro"),
	}],
    Plural: [{
		Nominativ: "PFA\\1"+tagSuffix("PFA\\2ūra"),
		Genitiv: "PFA\\1"+tagSuffix("PFA\\2ūrorum"),
		Dativ: "PFA\\1"+tagSuffix("PFA\\2ūris"),
		Akkusativ: "PFA\\1"+tagSuffix("PFA\\2ūra"),
		Ablativ: "PFA\\1"+tagSuffix("PFA\\2ūris"),
	}]
  }]
}]
var SupinumDeklination = [{ 
		"Supinum I": "PPP\\1"+tagSuffix("PPP\\2um"),
		"Supinum II": "PPP\\1"+tagSuffix("PPP\\2ū")
}]
var areGerundivumDeklination = [{ 
  M: [{
    Singular: [{
		Nominativ: "WORTSTAMM"+"a"+tagSuffix("ndus"),
		Genitiv: "WORTSTAMM"+"a"+tagSuffix("ndi"),
		Dativ: "WORTSTAMM"+"a"+tagSuffix("ndo"),
		Akkusativ: "WORTSTAMM"+"a"+tagSuffix("ndum"),
		Ablativ: "WORTSTAMM"+"a"+tagSuffix("ndo"),
	}],
    Plural: [{
		Nominativ: "WORTSTAMM"+"a"+tagSuffix("ndi"),
		Genitiv: "WORTSTAMM"+"a"+tagSuffix("ndorum"),
		Dativ: "WORTSTAMM"+"a"+tagSuffix("ndis"),
		Akkusativ: "WORTSTAMM"+"a"+tagSuffix("ndos"),
		Ablativ: "WORTSTAMM"+"a"+tagSuffix("ndis"),
	}]
  }], 
  F: [{
    Singular: [{
		Nominativ: "WORTSTAMM"+"a"+tagSuffix("nda"),
		Genitiv: "WORTSTAMM"+"a"+tagSuffix("ndae"),
		Dativ: "WORTSTAMM"+"a"+tagSuffix("ndae"),
		Akkusativ: "WORTSTAMM"+"a"+tagSuffix("ndam"),
		Ablativ: "WORTSTAMM"+"a"+tagSuffix("nda"),
	}],
    Plural: [{
		Nominativ: "WORTSTAMM"+"a"+tagSuffix("ndae"),
		Genitiv: "WORTSTAMM"+"a"+tagSuffix("ndarum"),
		Dativ: "WORTSTAMM"+"a"+tagSuffix("ndis"),
		Akkusativ: "WORTSTAMM"+"a"+tagSuffix("ndas"),
		Ablativ: "WORTSTAMM"+"a"+tagSuffix("ndis"),
	}]
  }], 
  N: [{
    Singular: [{
		Nominativ: "WORTSTAMM"+"a"+tagSuffix("ndum"),
		Genitiv: "WORTSTAMM"+"a"+tagSuffix("ndi"),
		Dativ: "WORTSTAMM"+"a"+tagSuffix("ndo"),
		Akkusativ: "WORTSTAMM"+"a"+tagSuffix("ndum"),
		Ablativ: "WORTSTAMM"+"a"+tagSuffix("ndo"),
	}],
    Plural: [{
		Nominativ: "WORTSTAMM"+"a"+tagSuffix("nda"),
		Genitiv: "WORTSTAMM"+"a"+tagSuffix("ndorum"),
		Dativ: "WORTSTAMM"+"a"+tagSuffix("ndis"),
		Akkusativ: "WORTSTAMM"+"a"+tagSuffix("nda"),
		Ablativ: "WORTSTAMM"+"a"+tagSuffix("ndis"),
	}]
  }]
}]
var areGerundiumDeklination = [{ 
		Nominativ: "INFINITIV",
		Genitiv: "WORTSTAMM"+"a"+tagSuffix("ndi"),
		Dativ: "WORTSTAMM"+"a"+tagSuffix("ndo"),
		Akkusativ: "WORTSTAMM"+"a"+tagSuffix("ndum"),
		Ablativ: "WORTSTAMM"+"a"+tagSuffix("ndo"),
}]
var ereGerundivumDeklination = [{ 
  M: [{
    Singular: [{
		Nominativ: "PRAESENS"+tagSuffix("ndus"),
		Genitiv: "PRAESENS"+tagSuffix("ndi"),
		Dativ: "PRAESENS"+tagSuffix("ndo"),
		Akkusativ: "PRAESENS"+tagSuffix("ndum"),
		Ablativ: "PRAESENS"+tagSuffix("ndo"),
	}],
    Plural: [{
		Nominativ: "PRAESENS"+tagSuffix("ndi"),
		Genitiv: "PRAESENS"+tagSuffix("ndorum"),
		Dativ: "PRAESENS"+tagSuffix("ndis"),
		Akkusativ: "PRAESENS"+tagSuffix("ndos"),
		Ablativ: "PRAESENS"+tagSuffix("ndis"),
	}]
  }], 
  F: [{
    Singular: [{
		Nominativ: "PRAESENS"+tagSuffix("nda"),
		Genitiv: "PRAESENS"+tagSuffix("ndae"),
		Dativ: "PRAESENS"+tagSuffix("ndae"),
		Akkusativ: "PRAESENS"+tagSuffix("ndam"),
		Ablativ: "PRAESENS"+tagSuffix("nda"),
	}],
    Plural: [{
		Nominativ: "PRAESENS"+tagSuffix("ndae"),
		Genitiv: "PRAESENS"+tagSuffix("ndarum"),
		Dativ: "PRAESENS"+tagSuffix("ndis"),
		Akkusativ: "PRAESENS"+tagSuffix("ndas"),
		Ablativ: "PRAESENS"+tagSuffix("ndis"),
	}]
  }], 
  N: [{
    Singular: [{
		Nominativ: "PRAESENS"+tagSuffix("ndum"),
		Genitiv: "PRAESENS"+tagSuffix("ndi"),
		Dativ: "PRAESENS"+tagSuffix("ndo"),
		Akkusativ: "PRAESENS"+tagSuffix("ndum"),
		Ablativ: "PRAESENS"+tagSuffix("ndo"),
	}],
    Plural: [{
		Nominativ: "PRAESENS"+tagSuffix("nda"),
		Genitiv: "PRAESENS"+tagSuffix("ndorum"),
		Dativ: "PRAESENS"+tagSuffix("ndis"),
		Akkusativ: "PRAESENS"+tagSuffix("nda"),
		Ablativ: "PRAESENS"+tagSuffix("ndis"),
	}]
  }]
}]
var ereGerundiumDeklination = [{ 
		Nominativ: "INFINITIV",
		Genitiv: "PRAESENS"+tagSuffix("ndi"),
		Dativ: "PRAESENS"+tagSuffix("ndo"),
		Akkusativ: "PRAESENS"+tagSuffix("ndum"),
		Ablativ: "PRAESENS"+tagSuffix("ndo"),
}]
var ireereGerundivumDeklination = [{ 
  M: [{
    Singular: [{
		Nominativ: "PRAESENS"+tagSuffix("endus"),
		Genitiv: "PRAESENS"+tagSuffix("endi"),
		Dativ: "PRAESENS"+tagSuffix("endo"),
		Akkusativ: "PRAESENS"+tagSuffix("endum"),
		Ablativ: "PRAESENS"+tagSuffix("endo"),
	}],
    Plural: [{
		Nominativ: "PRAESENS"+tagSuffix("endi"),
		Genitiv: "PRAESENS"+tagSuffix("endorum"),
		Dativ: "PRAESENS"+tagSuffix("endis"),
		Akkusativ: "PRAESENS"+tagSuffix("endos"),
		Ablativ: "PRAESENS"+tagSuffix("endis"),
	}]
  }], 
  F: [{
    Singular: [{
		Nominativ: "PRAESENS"+tagSuffix("enda"),
		Genitiv: "PRAESENS"+tagSuffix("endae"),
		Dativ: "PRAESENS"+tagSuffix("endae"),
		Akkusativ: "PRAESENS"+tagSuffix("endam"),
		Ablativ: "PRAESENS"+tagSuffix("enda"),
	}],
    Plural: [{
		Nominativ: "PRAESENS"+tagSuffix("endae"),
		Genitiv: "PRAESENS"+tagSuffix("endarum"),
		Dativ: "PRAESENS"+tagSuffix("endis"),
		Akkusativ: "PRAESENS"+tagSuffix("endas"),
		Ablativ: "PRAESENS"+tagSuffix("endis"),
	}]
  }], 
  N: [{
    Singular: [{
		Nominativ: "PRAESENS"+tagSuffix("endum"),
		Genitiv: "PRAESENS"+tagSuffix("endi"),
		Dativ: "PRAESENS"+tagSuffix("endo"),
		Akkusativ: "PRAESENS"+tagSuffix("endum"),
		Ablativ: "PRAESENS"+tagSuffix("endo"),
	}],
    Plural: [{
		Nominativ: "PRAESENS"+tagSuffix("enda"),
		Genitiv: "PRAESENS"+tagSuffix("endorum"),
		Dativ: "PRAESENS"+tagSuffix("endis"),
		Akkusativ: "PRAESENS"+tagSuffix("enda"),
		Ablativ: "PRAESENS"+tagSuffix("endis"),
	}]
  }]
}]
var ireereGerundiumDeklination = [{ 
		Nominativ: "INFINITIV",
		Genitiv: "PRAESENS"+tagSuffix("endi"),
		Dativ: "PRAESENS"+tagSuffix("endo"),
		Akkusativ: "PRAESENS"+tagSuffix("endum"),
		Ablativ: "PRAESENS"+tagSuffix("endo"),
}]
var Deklinationen = [
 	// verbkonjugationen
	{
	  id: "esse",
	  Deklination: "Konjugation von "+tagLatin("esse"),
	  Formen: esseKonjugation,
	  Infinitive: esseInfinitive,
	  Partizip: [{PFA:PFADeklination, PPP:noPartDeklination, PPA:noPartDeklination, Gerundivum:noPartDeklination }]
	},  
	{
	  id: "posse",
	  Deklination: "Konjugation von "+tagLatin("posse"),
	  Formen: posseKonjugation,
	  Infinitive: posseInfinitive,
	  Partizip: [{PFA:noPartDeklination, PPP:noPartDeklination, PPA:noPartDeklination, Gerundivum:noPartDeklination}]
	},  
	{
	  id: "are",
	  Deklination: "a-Konjugation",
	  Formen: aKonjugation,
	  Infinitive: aInfinitive,
	  Partizip: [{PPA:PPADeklination, PPP:PPPDeklination, PFA:PFADeklination, Gerundivum: areGerundivumDeklination,Gerundium: areGerundiumDeklination,Supinum: SupinumDeklination}]
	}, 
	{
	  id: "ere,ui",
	  Deklination: "e-Konjugation",
	  Formen: eKonjugation,
	  Infinitive: eInfinitive,
	  Partizip: [{PPA:PPADeklination, PPP:PPPDeklination, PFA:PFADeklination, Gerundivum: ereGerundivumDeklination,Gerundium: ereGerundiumDeklination,Supinum: SupinumDeklination}]
	}, 
	{
	  id: "ire",
	  Deklination: "i-Konjugation",
	  Formen: iKonjugation,
	  Infinitive: iInfinitive,
	  Partizip: [{PPA:PPADeklination, PPP:PPPDeklination, PFA:PFADeklination, Gerundivum: ireereGerundivumDeklination,Gerundium: ireereGerundiumDeklination,Supinum: SupinumDeklination}]
	}, 
	{
	  id: "ere,kon",
	  Deklination: "konsonantische Konjugation",
	  Formen: kKonjugation,
	  Infinitive: kInfinitive,
	  Partizip: [{PPA:PPADeklination, PPP:PPPDeklination, PFA:PFADeklination, Gerundivum: ireereGerundivumDeklination,Gerundium: ireereGerundiumDeklination,Supinum: SupinumDeklination}]
	}, 
	{
	  id: "ere,gem",
	  Deklination: "gemischte Konjugation",
	  Formen: gKonjugation,
	  Infinitive: gInfinitive,
	  Partizip: [{PPA:PPADeklination, PPP:PPPDeklination, PFA:PFADeklination, Gerundivum: ireereGerundivumDeklination,Gerundium: ireereGerundiumDeklination,Supinum: SupinumDeklination}]
	},  
	// adjektive
	{
	  id: "us,a,um",
	  Deklination: "a/o-Deklination",
	  Formen: aoAdjDeklination
	},  
	{
	  id: "is,is,e",
	  Deklination: "i-Deklination, zweiendig",
	  Formen: iDeklinationAdj2
	},   
	{
	  id: "_,is,e",
	  Deklination: "i-Deklination, dreiendig",
	  Formen: iDeklinationAdj3
	},   
	{
	  id: "ns,ntis",
	  Deklination: "i-Deklination, einendig",
	  Formen: iDeklinationAdj1
	},   
	{
	  id: "x,x,x,cis,cic,cis",
	  Deklination: "i-Deklination, einendig",
	  Formen: iDeklinationAdj1V2
	},   
	{
	  id: "_,_is",
	  Deklination: "konsonantische Deklination",
	  Formen: kDeklinationAdj
	}, 
	// substantive
	{
	  id: "a,ae",
	  Deklination: "a-Deklination",
	  Formen: aDeklination
	},
	{
	  id: "us,i",
	  Deklination: "o-Deklination [m]",
	  Formen: oDeklinationM
	},
	{
	  id: "er,ri",
	  Deklination: "o-Deklination [m]",
	  Formen: oDeklinationM_er_ri
	},
	{
	  id: "er,eri",
	  Deklination: "o-Deklination [m]",
	  Formen: oDeklinationM_er_eri
	},
	{
	  id: "_,i",
	  Deklination: "o-Deklination [m]",
	  Formen: oDeklinationM_i
	},
	{
	  id: "um,i",
	  Deklination: "o-Deklination [n]",
	  Formen: oDeklinationN
	},
	{
	  id: "es,ei",
	  Deklination: "e-Deklination",
	  Formen: eDeklination
	},
	{
	  id: "us,us",
	  Deklination: "u-Deklination",
	  Formen: uDeklination
	},
	{
	  id: "u,us",
	  Deklination: "u-Deklination",
	  Formen: uDeklination_cornu
	},
	{
	  id: "us,us,_,o",
	  Deklination: "u-Deklination",
	  Formen: uDeklination_domus
	},
	{
	  id: "is,s",
	  Deklination: "i-Deklination",
	  Formen: iDeklinationMF
	},
	{
	  id: "_,is",
	  Deklination: "i-Deklination",
	  Formen: iDeklinationN
	},
	{
	  id: "e,is",
	  Deklination: "i-Deklination",
	  Formen: iDeklinationN_e_is
	},
	{
	  id: "or/er/l,_is",
	  Deklination: "konsonantische Deklination",
	  Formen: kDeklinationM
	},
	{
	  id: "er,ris",
	  Deklination: "konsonantische Deklination",
	  Formen: kDeklinationM_er_ris
	},
	{
	  id: "os,oris",
	  Deklination: "konsonantische Deklination",
	  Formen: kDeklinationM_os_oris
	},
	{
	  id: "es,itis",
	  Deklination: "konsonantische Deklination",
	  Formen: kDeklinationM_es_itis
	},
	{
	  id: "o,onis",
	  Deklination: "konsonantische Deklination",
	  Formen: kDeklinationF_o_onis
	},
	{
	  id: "o,inis",
	  Deklination: "konsonantische Deklination",
	  Formen: kDeklinationF_o_inis
	},
	{
	  id: "as,atis",
	  Deklination: "konsonantische Deklination",
	  Formen: kDeklinationF_as_atis
	},
	{
	  id: "us,utis",
	  Deklination: "konsonantische Deklination",
	  Formen: kDeklinationF_us_utis
	},
	{
	  id: "x,gis",
	  Deklination: "konsonantische Deklination",
	  Formen: kDeklinationF_x_gis
	},
	{
	  id: "x,cis",
	  Deklination: "konsonantische Deklination",
	  Formen: kDeklinationF_x_cis
	},
	{
	  id: "us,eris",
	  Deklination: "konsonantische Deklination",
	  Formen: kDeklinationN_us_eris
	},
	{
	  id: "us,oris",
	  Deklination: "konsonantische Deklination",
	  Formen: kDeklinationN_us_oris
	},
	{
	  id: "men,minis",
	  Deklination: "konsonantische Deklination",
	  Formen: kDeklinationN_men_minis
	},
	{
	  id: "is,is",
	  Deklination: "gemischte Deklination",
	  Formen: gDeklination
	},
	{
	  id: "s,is",
	  Deklination: "gemischte Deklination",
	  Formen: gDeklination_s_is
	},
	{
	  id: "qui/quae/quod",
	  Deklination: "Relativpronomen: qui/quae/quod", //Konjugation von 
	  Formen: quiquaequodDeklination
	},
	{
	  id: "is/ea/id",
	  Deklination: "Demonstrativpronomen: is/ea/id", //Konjugation von
	  Formen: iseaidDeklination
	},
	{
	  id: "hic/haec/hoc",
	  Deklination: "hic/haec/hoc", //Konjugation von 
	  Formen: hichaechocDeklination
	},
	{
	  id: "quis/quid",
	  Deklination: "Interrogativpronomen: quis/quid", //Konjugation von 
	  Formen: quisquidDeklination
	},
	{
	  id: "ego/mei/mihi",
	  Deklination: "Personalpronomen (3. Person reflexiv)",//Konjugation vom 
	  Formen: egomeimihiDeklination,
	  hinweis: "Das Lateinische kennt eigentlich keine Personalpronomina der 3. Person. Stattdessen wird für „er,sie,es“ usw. das Demonstrativpronomen is,ea,id verwendet." 
	}// vgl. https://www.albertmartin.de/latein/grammatik/doku.php/personalpronomen, https://www.schule-bw.de/faecher-und-schularten/sprachen-und-literatur/latein/sprache/deklinationstabellen/pdf-word-openoffice/pdf/personalpronomen-tabelle.pdf, https://www.gottwein.de/LaGr/LGrPron00.php
	  
  ];
	
	function createTab(tab,el, id, display, typeid, captxt) {
		var tbtype;
		var output = document.getElementById(el);
		var tbl = document.createElement('table');
		tbtype = typeid
		tbl.setAttribute("id",id)
		var caption = tbl.createCaption(); // Tabellenüberschrift
		caption.innerHTML = captxt;
		tbl.style.display=display;
    
    var rowid="";

		tab.forEach(function (m, i) {
		var Reihe = tbl.insertRow(-1);
      
    // Reihenname aus erster Zelle?
    if (("id" in m[0]) ) {
      rowid = m[0].id;
    }
    Reihe.setAttribute("row",rowid);
      
		for (var j in m) {
      
			var Inhalt = m[j]["text"] ;
			
			if (m[j]["type"]!=null) if (m[j]["type"]==0) continue;
			var Zelle = Reihe.insertCell();
      // set col number
      Zelle.setAttribute("col", j);
      if (m[j]["genus"]!=null) Zelle.setAttribute("genus", m[j]["genus"]);
			if (m[j]["type"]!=null) if (m[j]["type"]==2) {
         Zelle.setAttribute("class", "marginal");
        if ("short" in m[j]) Zelle.setAttribute("short", m[j]["short"]);
      }

			if (m[j]["rowspan"]!=null) Zelle.setAttribute('rowSpan', m[j]["rowspan"]);
			if (m[j]["colspan"]!=null) Zelle.setAttribute('colSpan', m[j]["colspan"]);

			
	
			if (m[j]["type"]!=null & m[j]["type"]==3) {
				var input = document.createElement("input");
				Zelle.appendChild(input);
					input.type = "text";
					input.text = Inhalt;
					input.name = "in"+tbtype+m[j]["id"];
					input.setAttribute("id", "in"+tbtype+m[j]["id"]);
					input.onkeypress = function(event){
						if (event.keyCode == 13 || event.which == 13){
							pruefenweiter();
						} else {
							document.getElementById("ausgabe").querySelector("#inabfrageantwort").style.backgroundColor="";					
						}
					};
				var divel = document.createElement("div");
				Zelle.appendChild(divel);
				divel.innerHTML = "1. Versuch";
				divel.setAttribute("id", "hint"+tbtype+m[j]["id"]);
			} else if (m[j]["type"]!=null & m[j]["type"]==4) {
				var select = document.createElement("select");
				Zelle.appendChild(select);
					select.text = Inhalt;
					select.size = 10;
					select.name = "in"+tbtype+m[j]["id"];
					select.setAttribute("id", "in"+tbtype+m[j]["id"]);
			} else if (m[j]["type"]!=null & m[j]["type"]==5) { //[{id:"Abfragen", text:"", colspan:3, type:5}],
				//var select = document.createElement("button");
				//Zelle.appendChild(select);
				//	select.innerHTML = m[j]["id"];
				//	select.name = "in"+tbtype+m[j]["id"];
				//	select.setAttribute("id", "in"+tbtype+m[j]["id"]);
        // input statt button
        var select = document.createElement("input");
				Zelle.appendChild(select);
          select.setAttribute("type","button");
					select.setAttribute("value", m[j]["id"]);
					select.name = "in"+tbtype+m[j]["id"];
					select.setAttribute("id", "in"+tbtype+m[j]["id"]);
			} else if (m[j]["type"]!=null & m[j]["type"]==6) {
				//var select = document.createElement("button");
				//Zelle.appendChild(select);
				//select.innerHTML = "Hinweis";
				//select.name = "bhinweis"+tbtype+m[j]["id"];
				//select.setAttribute("id", "bhinweis"+tbtype+m[j]["id"]);
        var select = document.createElement("input");
				Zelle.appendChild(select);
          select.setAttribute("type","button");
					select.setAttribute("value", "Hinweis");
					select.name = "bhinweis"+tbtype+m[j]["id"];
					select.setAttribute("id", "bhinweis"+tbtype+m[j]["id"]);
				//var select = document.createElement("button");
				//Zelle.appendChild(select);
				//select.innerHTML = "Lösung";
				//select.name = "bloesung"+tbtype+m[j]["id"];
				//select.setAttribute("id", "bloesung"+tbtype+m[j]["id"]);
                var select = document.createElement("input");
				Zelle.appendChild(select);
          select.setAttribute("type","button");
					select.setAttribute("value", "Lösung");
					select.name = "bloesung"+tbtype+m[j]["id"];
					select.setAttribute("id", "bloesung"+tbtype+m[j]["id"]);
				//var select = document.createElement("button");
				//Zelle.appendChild(select);
				//select.innerHTML = "Prüfen";
				//select.name = "bpruefen"+tbtype+m[j]["id"];
				//select.setAttribute("id", "bpruefen"+tbtype+m[j]["id"]);
        var select = document.createElement("input");
				Zelle.appendChild(select);
          select.setAttribute("type","button");
					select.setAttribute("value", "Prüfen");
					select.name = "bpruefen"+tbtype+m[j]["id"];
					select.setAttribute("id", "bpruefen"+tbtype+m[j]["id"]);
				//var select = document.createElement("button");
				//Zelle.appendChild(select);
				//select.innerHTML = "Beenden";
				//select.name = "bbeenden"+tbtype+m[j]["id"];
				//select.setAttribute("id", "bbeenden"+tbtype+m[j]["id"]);
        var select = document.createElement("input");
				Zelle.appendChild(select);
          select.setAttribute("type","button");
					select.setAttribute("value", "Beenden");
					select.name = "bbeenden"+tbtype+m[j]["id"];
					select.setAttribute("id", "bbeenden"+tbtype+m[j]["id"]);
			} else if (m[j]["rot"]!=null & m[j]["rot"]==1) {
				//Zelle.setAttribute("id", "nout"+tbtype+m[j]["id"]);
				var div = document.createElement('div');
				Zelle.appendChild(div);
				div.setAttribute("id", "out"+tbtype+m[j]["id"]);
				div.setAttribute("class", "marginalrot");
        if ("short" in m[j]) {
          div.innerHTML = '<span class="full">'+Inhalt+'</span><span class="short">'+m[j]["short"]+'</span>';
        } else {                
				div.innerHTML = Inhalt;
        }
			} else {
        if ("short" in m[j]) {
          Zelle.innerHTML = '<span class="full">'+Inhalt+'</span><span class="short">'+m[j]["short"]+'</span>';
        } else {
          Zelle.innerHTML = Inhalt;
        }
			Zelle.setAttribute("id", "out"+tbtype+m[j]["id"]);
			
			}
			}
		})	
		output.appendChild(tbl)
	}



 
	function init() {
		var elem = document.getElementById('button1');
		createTab(Vokabellistetab,"ausgabe","tabVokabelliste","","Vokabeln","Lektionsauswahl");
		createTab(Abfragetab,"ausgabe","tabAbfrage","none","abfrage","Abfrage");
		createTab(Ergebnistab,"ausgabe","tabErgebnis","none","wArt","Testergebnisse");
		createTab(Infotab,"ausgabe","tabInfo","none","wArt","Worteigenschaften");
		createTab(DeklinationstabNomen,"ausgabe","tabDeklinationen","none","Nom","");
		createTab(DeklinationstabAdjektiv,"ausgabe","tabDeklinationenAdj","none","Adj","");
		createTab(DeklinationstabPronomen,"ausgabe","tabDeklinationenPron","none","Pron","");
		createTab(DeklinationstabReflPersPronomen,"ausgabe","tabDeklinationenReflPersPron","none","Pron","");
		createTab(Konjugationstab,"ausgabe","tabKonjugationen","none","Verb","");
		createTab(Imperativtab,"ausgabe","tabImperative","none","Verb","");
		createTab(Infinitivtab,"ausgabe","tabInfinitive","none","Verb","");
		createTab(Partiziptab,"ausgabe","tabPartizipien","none","Verb","");
    
	}
function splitValue(value, index) {
		if (index<0) index = value.length+index;
		return [value.substring(0, index) ,value.substring(index)];
	}
	
	function unstress(s) {
		s=s.replace(/ā/gi,"a");
		s=s.replace(/ū/gi,"u");
		s=s.replace(/ī/gi,"i");
		s=s.replace(/ō/gi,"o");
		s=s.replace(/ē/gi,"e");	
		return s;
	}
	
 // DeklinationenFiltern//
	function pluralDeklination(dekl) {
		var nurSingularDeklination = JSON.parse(JSON.stringify(dekl));
		nurSingularDeklination.Plural=emptyDeklination.Plural;
		return nurSingularDeklination;
	}
	function singularDeklination(dekl) {
		var nurPluralDeklination = JSON.parse(JSON.stringify(dekl));
		nurPluralDeklination.Singular=emptyDeklination.Singular;
		return nurPluralDeklination;
	}
	function patchFlektionRek(deklination,patch) {
		if (typeof(deklination)=="object" & patch!=null) {
			for (var par in deklination) { 
				if (typeof(deklination[par])=="string") 
					if (patch!=null) if (patch[par]!=null) {
						deklination[par] = patch[par]
					}
				if (typeof(patch[par]!=null)) patchFlektionRek(deklination[par],patch[par])
			}
			return(deklination)
		}
		return(null)
	}
	function patchFlektion(deklination, patch) {
		var dekl = JSON.parse(JSON.stringify(deklination));
		dekl = patchFlektionRek(dekl,patch) ;
		<!-- for (var par1 in dekl) {  -->
			<!-- for (var par2 in dekl[par1]) {  -->
				<!-- if (patch[par1]!=null) if (patch[par1][par2]!=null) dekl[par1][par2] = patch[par1][par2] -->
			<!-- } -->
		<!-- } -->
		return dekl
	}
	
	function ppappp(s, reg) {
		var ppp, pfa;
		if (unstress(s)=="-")  {
			ppp = "NOPPP"; 
			pfa = "NOPFA";	
		} else if (unstress(s).endsWith("urus")|unstress(s).endsWith("urum"))  {
		//if (unstress(s).endsWith("turus")|unstress(s).endsWith("tura")|unstress(s).endsWith("turum"))  {
			ppp = "NOPPP"; 
			pfa = splitValue(s,-4)[0]; //-5
		//} else if (unstress(s).endsWith("ura"))  {
		//	ppp = "NOPPP"; 
		//	pfa = splitValue(s,-3)[0]; //-5
		} else if (unstress(s).endsWith("us")|unstress(s).endsWith("um"))  {
			ppp = splitValue(s,-2)[0]; //ppp = splitValue(s,-3)[0]; 
			pfa = ppp;
		//} else if (unstress(s).endsWith("a"))  {
		//	ppp = splitValue(s,-1)[0];  
		//	pfa = ppp;
		} else {
			ppp = reg+"t";
			pfa = ppp;	
		}
		return [ppp, pfa];
	}
	
	function testeStamm(stamm1, stamm2) {
		if (stamm2=="-" | (unstress(stamm1)==unstress(stamm2))| (unstress(stamm2).substring(0,1)=="-" & unstress(stamm1).endsWith(unstress(stamm2).substring(1,stamm2.length))) ) {
			return true;
		}
		else return false;
	}
	
	function getWortstamm(w) {
    console.log("getWortstamm");
    var s=w.ltW;
		var spl = s.split(/,\s*/); // /[ ,]+/ //s.replace(","," ")
		var spl1 = "";
		var spl2 = "";
		var spl3 = "";
		var spl4 = "";
		if (spl[0]!=null)spl1=spl[0];
		if (spl[1]!=null)spl2=spl[1];
		if (spl[2]!=null)spl3=spl[2];
		if (spl[3]!=null)spl4=spl[3];
		var stamm1, stamm2, stamm3, praesstamm, perfstamm, ppp, pfa, pstamm, bindung, unpers;
		var unpPass = false;
    console.log("regexptest");
    console.log(/kein Passiv([,;]+.*)?$/gm.test('kein Passiv'));
    //ltCom:"kein Passiv", kein:"Passiv", pass:3.Sg
		if (w.pass=="3.Sg"|w.pass=="3.") unpPass=true;
		// a-Konjugation
		if (unstress(spl1).endsWith("are") & unstress(spl2).endsWith("o")) { 
			praesstamm = splitValue(spl1,-3)[0]; 
			stamm2 = splitValue(spl2,-1)[0];
			if (unstress(spl3).endsWith("i")) { perfstamm = splitValue(spl3,-1)[0] ;
			} else {perfstamm = praesstamm+"āv"; }
			var pppobj = ppappp(spl4, praesstamm+"ā");
			ppp = pppobj[0];
			pfa = pppobj[1];
			pstamm=splitValue(spl1,-2)[0];
			bindung="";
			if ((stamm2=="-" | (praesstamm==stamm2))) {
				ausgeben(null, "are", null, praesstamm, perfstamm, ppp,pfa,pstamm,bindung, unpPass);  //ausgeben(praesstamm, "are", spl1); //ausgeben(s2[0], s2[1], spl1); //return [praesstamm, "are"];
				}
		} else if (unstress(spl1).endsWith("ire") & unstress(spl2).endsWith("io")) { //audīre, audiō, audīvī, audītum
			stamm2 = splitValue(spl2,-2)[0];
			praesstamm = splitValue(spl1,-3)[0]; 
			if (unstress(spl3).endsWith("i")) {
				perfstamm = splitValue(spl3,-1)[0]; 
			} else perfstamm = praesstamm+"īv"; 
			var pppobj = ppappp(spl4, praesstamm+"ī");
			ppp = pppobj[0];
			pfa = pppobj[1];
			pstamm=splitValue(spl2,-1)[0];
			bindung="ē";
			if ((stamm2=="-" | (praesstamm==stamm2))) 
				ausgeben(null, "ire", null, praesstamm, perfstamm, ppp,pfa,pstamm,bindung, unpPass); 
		} else if (unstress(spl1).endsWith("ere") & unstress(spl2).endsWith("eo")) { //monēre, moneō, monuī, monitum
    //  console.log("e-Deklination");
			stamm2 = splitValue(spl2,-2)[0];
			praesstamm = splitValue(spl1,-3)[0]; 
			if (unstress(spl3).endsWith("i")) {
				perfstamm = splitValue(spl3,-1)[0]; 
			} else perfstamm = praesstamm+"u"; 
			var pppobj = ppappp(spl4, praesstamm+"i");
			ppp = pppobj[0];
			pfa = pppobj[1];
			pstamm=splitValue(spl1,-2)[0];
			bindung="";
     // console.log(stamm2)
     // console.log(praesstamm)
			if ((stamm2=="-" | (praesstamm==stamm2))) 
				ausgeben(null, "ere,ui", null, praesstamm, perfstamm, ppp,pfa,pstamm,bindung, unpPass); 
		} else if (unstress(spl1).endsWith("ere") & unstress(spl2).endsWith("io")) { //capere, capiō, cēpī, captum
			stamm2 = splitValue(spl2,-2)[0];
			praesstamm = splitValue(spl1,-3)[0]; 
			if (unstress(spl3).endsWith("i")) {
				perfstamm = splitValue(spl3,-1)[0]; 
			} else perfstamm = praesstamm; 
			var pppobj = ppappp(spl4, praesstamm+"");
			ppp = pppobj[0];
			pfa = pppobj[1];
			pstamm=splitValue(spl2,-1)[0];
			bindung="ē";
			if ((stamm2=="-" | (praesstamm==stamm2))) 
				ausgeben(null, "ere,gem", null, praesstamm, perfstamm, ppp,pfa,pstamm,bindung, unpPass); 
		} else if (unstress(spl1).endsWith("ere") & unstress(spl2).endsWith("o")) { //regere, regō, rēxī, rēctum
      console.log("konsonantische");
			stamm2 = splitValue(spl2,-1)[0];
			praesstamm = splitValue(spl1,-3)[0]; 
			if (unstress(spl3).endsWith("i")) {
				perfstamm = splitValue(spl3,-1)[0]; 
			} else perfstamm = praesstamm; 
			var pppobj = ppappp(spl4, praesstamm+"ī");
			ppp = pppobj[0];
			pfa = pppobj[1];
			pstamm=splitValue(spl2,-1)[0]; //=stamm2
			bindung="ē";
     // console.log(stamm2)
     // console.log(praesstamm)
			if ((stamm2=="-" | (praesstamm==stamm2))) 
				ausgeben(null, "ere,kon", null, praesstamm, perfstamm, ppp,pfa,pstamm,bindung, unpPass); 
		} else if ((unstress(spl1)=="esse" & unstress(spl2)=="sum")|s=="esse") {
				ausgeben(null, "esse", null,"sum","fu","-","fut"); //ausgeben(s2[0], s2[1], spl1); //return [stamm1, "are"];
				
		} else if (unstress(spl1)=="posse" & unstress(spl2)=="possum") {
				ausgeben(null, "posse", null, "pussum", "potu", "","","posse",""); //ausgeben(s2[0], s2[1], spl1); //return [stamm1, "are"];
		 
		
		// Deklinationen
		} else if (unstress(spl1).endsWith("us") & unstress(spl2).endsWith("a") & unstress(spl3).endsWith("um")) { // a/o-Deklination
			stamm1 = splitValue(spl1,-2)[0]; 
			stamm2 = splitValue(spl2,-1)[0];
			stamm3 = splitValue(spl3,-2)[0];
			if ((stamm2=="-" | (stamm1==stamm2))&(stamm3=="-" | (stamm1==stamm3))) {
				deklinationAusgeben(stamm1, "us,a,um", w, spl1);//ausgeben(stamm1, "us,a,um", spl1); //return [stamm1, "us,a,um"];
				return;
				}
		} else if (unstress(spl1).endsWith("is") & unstress(spl2).endsWith("is") & unstress(spl3).endsWith("e")) {  // i-Deklination Adjektive
			stamm1 = splitValue(spl1,-2)[0]; 
			stamm2 = splitValue(spl2,-2)[0];
			stamm3 = splitValue(spl3,-1)[0];
			if ((stamm2=="-" | (stamm1==stamm2))&(stamm3=="-" | (stamm1==stamm3))) {
				ausgeben(stamm1, "is,is,e", spl1); //return [stamm1, "is,is,e"];
				return;
				}
		} else if (unstress(spl2).endsWith("is") & unstress(spl3).endsWith("e")) {
			stamm1 = spl1; 
			stamm2 = splitValue(spl2,-2)[0];
			stamm3 = splitValue(spl3,-1)[0];
			if ((stamm2=="-" | (stamm1==stamm2))&(stamm3=="-" | (stamm1==stamm3))) {
				ausgeben(stamm1, "_,is,e", spl1); //return [stamm1, "_,is,e"];
				return;
				}
		} else if (unstress(spl1).endsWith("ns") & unstress(spl2).endsWith("ntis")) {
			stamm1 = splitValue(spl1,-2)[0]; 
			stamm2 = splitValue(spl2,-4)[0];
			if ((testeStamm(stamm1, stamm2))) {
				deklinationAusgeben(stamm1, "ns,ntis", w); //return [stamm1, "ns,ntis"];
				return;
				}
		} else if (unstress(spl1).endsWith("es") & unstress(spl2).endsWith("ium")) {
			stamm1 = splitValue(spl1,-2)[0]; 
			stamm2 = splitValue(spl2,-3)[0];
			//if (testeStamm(stamm1, stamm2)) {
				w["nurplural"]="1"; // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				deklinationAusgeben(stamm1, "s,is", w);
				return;
			//	}
		} else if (unstress(spl1).endsWith("x") & unstress(spl2).endsWith("cis")) {
			stamm1 = splitValue(spl1,-1)[0]; 
			stamm2 = splitValue(spl2,-3)[0];
			if ((testeStamm(stamm1, stamm2))) {
				deklinationAusgeben(stamm1, "x,cis", w); //return [stamm1, "x,cis"];
				return;
				}
		} else if ((unstress(spl1)=="vetus" & unstress(spl2)=="veteris")| (unstress(spl1)=="dives" & unstress(spl2)=="divitis") | (unstress(spl1)=="pauper" & unstress(spl2)=="pauperis") | (unstress(spl1)=="princeps" & unstress(spl2)=="principis") | (unstress(spl1)=="compos" & unstress(spl2)=="compotis") | (unstress(spl1)=="superstes" & unstress(spl2)=="superstitis") | (unstress(spl1)=="sospes" & unstress(spl2)=="sospitis") | (unstress(spl1)=="particeps"  & unstress(spl2)=="participis")) {
			stamm2 = splitValue(spl2,-2)[0];
			deklinationAusgeben(stamm1, "_,_is", w); //return [stamm2, "_,_is"];
			return;
	
		} else if (unstress(spl1).endsWith("es") & unstress(spl2).endsWith("ei")) {	// e-Deklination "es,ei"
			stamm1 = splitValue(spl1,-2)[0]; 
			stamm2 = splitValue(spl2,-2)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "es,ei", w); //return [stamm1, "es,ei"];
				return;
				}
		
		
		// k-Deklination (femininum)
		} else if (unstress(spl1).endsWith("o") & unstress(spl2).endsWith("onis")) { 
			stamm1 = splitValue(spl1,-1)[0]; 
			stamm2 = splitValue(spl2,-4)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "o,onis", w); //return [stamm1, "o,onis"];
				return;
				}
		} else if (unstress(spl1).endsWith("o") & unstress(spl2).endsWith("inis")) {
			stamm1 = splitValue(spl1,-1)[0];
			stamm2 = splitValue(spl2,-4)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "o,inis", w); //return [stamm1, "o,inis"];	
				return;
				}
		} else if (unstress(spl1).endsWith("as") & unstress(spl2).endsWith("atis")) {
			stamm1 = splitValue(spl1,-2)[0]
			stamm2 = splitValue(spl2,-4)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "as,atis", w); //return [stamm1, "as,atis"];	
				return;
				}
		} else if (spl1.endsWith("us") & unstress(spl2).endsWith("utis")) {
			stamm1 = splitValue(spl1,-2)[0]
			stamm2 = splitValue(spl2,-4)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "us,utis", w); //return [stamm1, "us,utis"];
				return;
				}
		} else if (spl1.endsWith("x") & unstress(spl2).endsWith("cis")) {
			stamm1 = splitValue(spl1,-1)[0]
			stamm2 = splitValue(spl2,-3)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "x,cis", w); //return [stamm1, "x,cis"];
				return;
				}
		}	
		if (spl1.endsWith("x") & unstress(spl2).endsWith("gis")) {
			stamm1 = splitValue(spl1,-1)[0]
			stamm2 = splitValue(spl2,-3)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "x,gis", w); //return [stamm1, "x,gis"];	
				return;
				}
				

		// k-Deklination (neutrum)
		} else if (spl1.endsWith("us") & unstress(spl2).endsWith("eris")) {
			stamm1 = splitValue(spl1,-2)[0]
			stamm2 = splitValue(spl2,-4)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "us,eris", w); //return [stamm1, "us,eris"];
				return;
				}
		} else if (spl1.endsWith("us") & unstress(spl2).endsWith("oris")) {
			stamm1 = splitValue(spl1,-2)[0]
			stamm2 = splitValue(spl2,-4)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "us,oris", w); //return [stamm1, "us,oris"];
				return;
				}	
		} else if (spl1.endsWith("men") & unstress(spl2).endsWith("minis")) { 
			stamm1 = splitValue(spl1,-3)[0]
			stamm2 = splitValue(spl2,-5)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "men,minis", w); //return [stamm1, "men,minis"];	
				return;
				}
				
		// g-Deklination
		} else if (spl1.endsWith("x") & unstress(spl2).endsWith("gis")) {
			stamm1 = splitValue(spl1,-1)[0]
			stamm2 = splitValue(spl2,-4)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "x,gis", w); //return [stamm1, "x,gis"];	
				return;
				}
				
		
		
		// i-Deklination neutrum II
		} else if (spl1.endsWith("e") & unstress(spl2).endsWith("is")) {
			stamm1 = splitValue(spl1,-1)[0]
			stamm2 = splitValue(spl2,-2)[0]
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "e,is", w); //return [stamm1, "e,is"];
				return;
				}
		
		  // k-Deklination (maskulinum)
		} else if (spl1.endsWith("or") & unstress(spl2).endsWith("oris")) {
			stamm1 = splitValue(spl1,-2)[0]
			stamm2 = splitValue(spl2,-4)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(spl1, "or/er/l,_is", w); //return [spl1, "or/er/l,_is"];
				return;
				}
		} else if (spl1.endsWith("os") & unstress(spl2).endsWith("oris")) {
			stamm1 = splitValue(spl1,-2)[0]
			stamm2 = splitValue(spl2,-4)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "os,oris", w); //return [stamm1, "os,oris"];
				return;
				}
		} else if (spl1.endsWith("es") & unstress(spl2).endsWith("itis")) {
			stamm1 = splitValue(spl1,-2)[0];
			stamm2 = splitValue(spl2,-4)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "es,itis", w); //return [stamm1, "os,oris"];
				return;
				}
		} else if (spl1.endsWith("er") & unstress(spl2).endsWith("eris")) {
			stamm1 = splitValue(spl1,-2)[0]
			stamm2 = splitValue(spl2,-4)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "or/er/l,_is", w); //return [spl1, "or/er/l,_is"];
				return;
				}   
		} else if ((spl1.endsWith("al") & unstress(spl2).endsWith("alis"))|(spl1.endsWith("ar") & unstress(spl2).endsWith("aris"))) { // // i-Deklination (neutrum) I  animal par mare unten nochmal
			stamm1 = spl1; //splitValue(spl1,-2)[0]
			stamm2 = splitValue(spl2,-2)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "_,is", w); //return [stamm1, "_,is"];
				return;
				}
		} else if (spl1.endsWith("l") & unstress(spl2).endsWith("lis")) {  //unterscheide animal lis sal salis?
			stamm1 = spl1
			stamm2 = splitValue(spl2,-2)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "or/er/l,_is", w); //return [spl1, "or/er/l,_is"];
				return;
				}
		} else if (spl1.endsWith("er") & unstress(spl2).endsWith("ris")) {
			stamm1 = splitValue(spl1,-2)[0]
			stamm2 = splitValue(spl2,-3)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "er,ris", w); //return [stamm1, "er,ris"];
				return;
				}
		} else if ((spl1.endsWith("is") & unstress(spl2).endsWith("is")) | (unstress(spl1)=="vis") ) {
			stamm1 = splitValue(spl1,-2)[0]	;
			stamm2 = splitValue(spl2,-2)[0]; 
			if (unstress(spl1)=="vis" | unstress(spl1)=="turris" | unstress(spl1)=="febris"| unstress(spl1)=="sitis") { 
				deklinationAusgeben(stamm1, "is,s", w); //return [stamm1, "is,s"];
			} else if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "is,is", w); //return [stamm1, "is,is"];
				return;
			}
		} else if (spl1.endsWith("s") & unstress(spl2).endsWith("is")) {
			stamm1 = splitValue(spl1,-1)[0]
			stamm2 = splitValue(spl2,-2)[0]
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "s,is", w); //return [stamm1, "is,is"];
				return;
				}
				// i-Deklination (neutrum) I  animal par mare
		} else if (unstress(spl2).endsWith("is")) { // par paris
			stamm1 = spl1; //splitValue(spl1,-2)[0]
			stamm2 = splitValue(spl2,-2)[0];
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm2, "_,is", w, spl1); //return [stamm1, "_,is"];
				return;
				}
		} else if (spl1.endsWith("um") & unstress(spl2).endsWith("i")) {
			stamm1 = splitValue(spl1,-2)[0]
			stamm2 = splitValue(spl2,-1)[0]
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "um,i", w); //return [stamm1, "um,i"];
				return;
				}
		} else if (spl1.endsWith("a") & unstress(spl2).endsWith("orum")) {
			stamm1 = splitValue(spl1,-1)[0]
			stamm2 = splitValue(spl2,-4)[0]
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "um,i", w); //return [stamm1, "um,i"];
				return;
				}
		} else if (spl1.endsWith("us") & unstress(spl2).endsWith("i")) {
			stamm1 = splitValue(spl1,-2)[0]
			stamm2 = splitValue(spl2,-1)[0]
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "us,i", w); //return [stamm1, "us,i"];
				return;
				}
		} else if (spl1.endsWith("i") & unstress(spl2).endsWith("orum")) { //Plural, o-Konjugation
			stamm1 = splitValue(spl1,-1)[0];
			stamm2 = splitValue(spl2,-4)[0];
			w["nurplural"]="1"; //!!!!!!
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "us,i", w); //return [stamm1, "us,i"];
				return;
				}
		} else if (spl1.endsWith("er") & unstress(spl2).endsWith("eri")) {
			stamm1 = splitValue(spl1,-2)[0]
			stamm2 = splitValue(spl2,-3)[0]
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "er,eri", w); //return [stamm1, "er,eri"];
				return;
				}
		} else if (spl1.endsWith("er") & unstress(spl2).endsWith("ri")) {
			stamm1 = splitValue(spl1,-2)[0]
			stamm2 = splitValue(spl2,-2)[0]
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "er,ri", w); //return [stamm1, "er,ri"];
				return;
				}
		} else if (spl1.endsWith("r") & unstress(spl2).endsWith("ri")) { // vir viri u.a.? allgemein umschreiben?
			stamm1 = spl1;
			stamm2 = splitValue(spl2,-1)[0]; 
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "_,i", w, spl1); 
				return;
				}
		} else if (spl1.endsWith("a") & spl2.endsWith("ae")) {
			stamm1 = splitValue(spl1,-1)[0]
			stamm2 = splitValue(spl2,-2)[0]
			if (testeStamm(stamm1, stamm2)){
				deklinationAusgeben(stamm1, "a,ae", w);//ausgeben(stamm1, "a,ae", spl1); //return [stamm1, "a,ae"];
				return;
				}
		} else if (spl1.endsWith("ae") & spl2.endsWith("arum")) {
			stamm1 = splitValue(spl1,-2)[0]
			stamm2 = splitValue(spl2,-4)[0]
			if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "a,ae", w);//ausgeben(stamm1, "a,ae", spl1); //return [stamm1, "a,ae"];
				return;
				}
		
		// u-Deklination
		} else if (unstress(spl1).endsWith("us") & unstress(spl2).endsWith("us")) {
			stamm1 = splitValue(spl1,-2)[0]
			stamm2 = splitValue(spl2,-2)[0]
			if (unstress(spl1)=="domus") {
				deklinationAusgeben(stamm1, "us,us,_,o", w); //return [stamm1, "us,us,_,o"];
				return;
				}
			else if (testeStamm(stamm1, stamm2)) {
				deklinationAusgeben(stamm1, "us,us", w); //return [stamm1, "us,us"];
				return;
				}
		} else if (unstress(spl1).endsWith("u") & unstress(spl2).endsWith("us")) {
			stamm1 = splitValue(spl1,-1)[0]; //alert(stamm1);
			stamm2 = splitValue(spl2,-2)[0]; //alert(stamm2);
			if (stamm2=="-" | (stamm1==stamm2)  ) {  
				deklinationAusgeben(stamm1, "u,us", w); //return [stamm1, "u,us"];
				return;
			}
		} else if (unstress(spl1).endsWith("qui/quae/quod")|(unstress(spl1).endsWith("qui")&unstress(spl2).endsWith("quae")&unstress(spl3).endsWith("quod"))) { 
			ausgeben(null, "qui/quae/quod", null, null, null, null);
		} else if (unstress(spl1).endsWith("is/ea/id")|(unstress(spl1)=="is"&unstress(spl2)=="ea"&unstress(spl3)=="id")) { 
			ausgeben(null, "is/ea/id", null, null, null, null);
		} else if (unstress(spl1).endsWith("hic/haec/hoc")||(unstress(spl1)=="hic"&unstress(spl2)=="haec"&unstress(spl3)=="hoc")) {  
			ausgeben(null, "hic/haec/hoc", null, null, null, null);
		} else if (unstress(spl1).endsWith("ego/mei/mihi")|unstress(spl1)=="ego"|unstress(spl1)=="mei"|unstress(spl1)=="mihi"|unstress(spl1)=="me"|unstress(spl1)=="tu"|unstress(spl1)=="tui"|unstress(spl1)=="tibi"|unstress(spl1)=="te") { 
			ausgeben(null, "ego/mei/mihi", null, null, null, null);
		} else if (unstress(spl1)=="quis"|unstress(spl1)=="quid"|unstress(spl1)=="quis?"|unstress(spl1)=="quid?") { 
			deklinationAusgeben("", "quis/quid", w);
			//ausgeben(null, "quis/quid", null, null, null, null);
		}
		//return [null,null];    
	}
	
	function lWorliste(wliste) { console.log("lWorlliste --wann passiert das - nie??")
		wortliste=wliste; //global var used in abfrage
		var sel = document.getElementById("inVokabelnVokabeln"); //document.getElementById("mySelect");
		//sel.setAttribute("onchange",  "selDeklinieren(this)");
    sel.onchange = selDeklinieren(this);
    var selul = document.getElementById("ulVokabelnVokabeln"); 
    selul.innerHTML="";
    console.log(wliste);
    console.log("länge");
    console.log(length(wliste));
	//	sel.options.length = 0;
		for (var id in wliste) {			
			var opt = document.createElement('li'); //var opt = document.createElement('option');
		//	opt.appendChild( document.createTextNode(wliste[id][0]["lt"][0]["w"]+' - '+wliste[id][0]["de"][0]["w"]) );
      opt.innerHTML='<div><table cellspacing="0"><tr><td width="50%" valign="top">'+wliste[id]["ltW"]+'</td><td width="15px"></td><td width="50%" valign="top">'+wliste[id]["deW"]+'</td></tr></table></div>';
      opt.setAttribute("latin", wliste[id]["ltW"]);
			opt.value = id; 
			selul.appendChild(opt);  
		}
      //selectClickUpdate();
	}
function hideTable(s) {
		var container;
		container = document.getElementById(s);
		container.style.display="none";
	}	
	function showTable(s) {
		var container;
		container = document.getElementById(s);
		container.style.display="";
	}	
	function hideTables() {
		hideTable("tabInfo");
		//hideTable("tabErgebnis");
		//hideTable("tabVokabelliste");
		hideTable("tabKonjugationen");
		hideTable("tabImperative");
		hideTable("tabInfinitive");
		hideTable("tabPartizipien");
		hideTable("tabDeklinationenAdj");
		hideTable("tabDeklinationenPron");
		hideTable("tabDeklinationenReflPersPron");
		hideTable("tabDeklinationen");
	}
	
	function lGenus(g) {
		if (g=="n") {
			g = "neutrum"
		} else if (g=="f") {
			g = "femininum"
		} else if (g=="m") {
			g = "maskulinum"
		}
		return "<genus>"+g+"</genus>";
	}  
	
	function wortformat(s) {
		var ind = s.indexOf(",")
		if (ind < 0) {
			return "<grundform>"+s+"</grundform>";
		} else return "<grundform>"+s.substring(0,s.indexOf(",")+1)+"</grundform>"+s.substring(s.indexOf(",")+1);
	}
	
	function printWortinfo(w) {
    console.log("printWortinfo(wortperm[worti], aworte):"+w)
//		if(wliste==null) wliste=wortliste;
		var container = document.getElementById("tabInfo");
		//var mkasus=w.ltmit; 
		//if (mkasus==null) {
		var	mkasus="";
		//} else mkasus=" "+mitKasus(mkasus); 
		var hint=w.ltCom; 
		if (hint==null) {
			hint="";
		} else hint=" "+tagHint(hint); 
		 
		var deinfo=w.deCom; 
		if (deinfo==null) {
			deinfo="";
		} else deinfo=" "+tagDeHinweis(deinfo); 
		container.querySelector("#outwArtlat" ).innerHTML=tagLatin(wortformat(w.ltW))+mkasus+ hint;
		container.querySelector("#outwArttype" ).innerHTML=tagWArt(w.typ);
		container.querySelector("#outwArtde" ).innerHTML=tagDeutsch(formatArticle(w.deW))+deinfo;
		var genus = w.ltG;
		if (genus==null) {
			container.querySelector("#outwArtgenus" ).parentNode.style.display="none";
		} else {
			container.querySelector("#outwArtgenus" ).innerHTML=lGenus(genus);
			container.querySelector("#outwArtgenus" ).parentNode.style.display="";
		}
		
	}
	
	function repstamm(s,praesstamm,perfstamm,ppp,pfa,pstamm,bindung) {
		s=s.replace(/SHORTWORTSTAMM/gi,shortLastVokal(praesstamm));
		s=s.replace(/SHORTPERFEKT/gi,shortLastVokal(perfstamm));
		s=s.replace(/SHORTPPP/gi,shortLastVokal(ppp));
		s=s.replace(/WORTSTAMM/gi,praesstamm);
		s=s.replace(/PERFEKT/gi,perfstamm);
		if (ppp!="NOPPP") {
			s=s.replace(/PPP\\1/gi,ppp.substring(0,ppp.length-1));
			s=s.replace(/PPP\\2/gi,ppp.substring(ppp.length-1));
		}
		s=s.replace(/PPP/gi,ppp);
		if (pfa!="NOPFA") {
			s=s.replace(/PFA\\1/gi,pfa.substring(0,pfa.length-1));
			s=s.replace(/PFA\\2/gi,pfa.substring(pfa.length-1));
		}
		s=s.replace(/PFA/gi,pfa);
		s=s.replace(/PRAESENS/gi,pstamm);
		s=s.replace(/BINDUNG/gi,bindung);
		return s;
	}
	function rpDekStamm(s,stamm) {
		s=s.replace(/-/gi,stamm);
		return s;
	}
	
	function maxhints(w) {return Math.floor(w.length/2);}
	
	function hint1(w, nr) { // 0     5-4-2-1
	    if (w.substring(0,4)=="der "||w.substring(0,4)=="die "||w.substring(0,4)=="das ") {
			return w.substring(0,4)+hint1(w.substring(4), nr);
		}
	    var out = "";
		//if (maxhints(w)<nr||nr<1) return null;
		var ch = "-";
		for (let i = w.length; i > 0; i--) {
			if (i==1 || ((w.length-i)%2==0)&&((w.length-i)<2*nr)&&w.length>2) {
				out=w.substring(i-1,i)+out;
			} else {
				out=ch+out;
			}
		}
		return out;
	}
	
	function hintall(w, nr) {
		var ws = w.split(/[;,]\s*/); 
		for (var wi in ws) { 
			ws[wi]=hint1(ws[wi], nr);
		}	
		return ws.join("<br />")
	}
	
	function newhint() {
		abfragehinweis+=1;
		var hinweis =  hintall(abfrageLoesung(),abfragehinweis);
		var containerOut = document.getElementById("tabAbfrage"); 
		containerOut.querySelector("#outabfragehinweis" ).innerHTML=hinweis;	
		document.getElementById("outabfragerowHinweis").parentNode.style.display="";
	}
  

	var abfragepausiert=false;
	var tout;
	var aworte=[]; //wortliste1;
	var worti=0;
	var wortperm;
	var fantworten=[];
	var rantworten=[];
	var uantworten=[];
	var fantworten_ind=[];
	var rantworten_ind=[];
	var uantworten_ind=[];
	var abfrageversuch=1;
	var abfragehinweis=0;
	var abfragespoiled=false;
	RegExp.escape = function(string) {
	  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
	};
	RegExp.escape2 = function(string) {
	  return "^"+string.replace(/[-\/\\^$*+?.|[\]{}]/g, '\\$&')+"$";
	};
	function ergRichtig(richtig) {
		var containerOut = document.getElementById("ausgabe"); 
		//containerOut.querySelector("#inabfrageantwort").value="";
		if (richtig==true) {
			containerOut.querySelector("#inabfrageantwort").style.backgroundColor="DarkSeaGreen";
		} else {
			containerOut.querySelector("#inabfrageantwort").style.backgroundColor="coral";
		}
		printWortinfo(aworte[wortperm[worti]]);  //printWortinfo(wortperm[worti], aworte)
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				
		//showTable("tabInfo");
		//var container = document.getElementById("tabInfo");
		//container.style.display="";//"none";
	}
	function shuffleArr(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
	function abfragestart() { 
    console.log("abfragestart");
		worti=0;
    ////
    var voc_list = $('#ulVokabelnVokabeln');
    //var wortliste = voc_list.children();
    ////
    
    // Vokabeln ausgewählt?
    if ($('#ulVokabelnVokabeln').children().first().attr("ltw")==undefined) {
      console.log("keine Vokabeln ausgewählt!");
       $('#msg').html('<span><strong>Keine Vokabeln ausgewählt!</strong></span>');
      return;
    }
    
		aworte=[...wortliste];//wortliste;
		wortperm=[...Array(aworte.length).keys()];
		shuffleArr(wortperm); //zufällige reihenfolge  
		hideTables();
		hideTable("tabVokabelliste");
    
		document.getElementById("outabfragerowHinweis").parentNode.style.display="none";
		document.getElementById("hintabfrageantwort").innerHTML="";
    
    // Resultate löschen
    document.getElementById("inAntwortenResultAufAnhieb").innerHTML="";
    document.getElementById("inAntwortenResultUnsicher").innerHTML="";
    document.getElementById("inAntwortenResultNichtGewusst").innerHTML="";
    

		showTable("tabAbfrage");
		abfragehinweis=0;
		abfrageversuch=1;
		abfragen();	
	}
	function abfragen() {
		var containerOut = document.getElementById("ausgabe"); 
		containerOut.querySelector("#inabfrageantwort").value="";
		
		var wort = aworte[wortperm[worti]]; //aworte[[wortperm[worti]]][0]; 
    console.log("wort:"+wort);
    console.log("worti:"+worti);
		var containerOut = document.getElementById("ausgabe"); 
		containerOut.querySelector("#outabfragefrage" ).innerHTML=tagLatin(wortformat(wort.ltW))+mitKasus(wort.ltCom)+ tagHint(wort.deCom);	
		document.getElementById("inabfrageantwort").focus();	
		abfragepausiert=false;	
	}
	function abfrageLoesung() {
		return aworte[wortperm[worti]].deW;
	}
	function pruefeloesungOne(x,y) {//alert(x+"-"+y);
		//if (x==y) return true
		var xExp = RegExp.escape2(x);
		xExp=formatREbrackcorr(xExp);
		xExp=formatREbrackopt(xExp);
		xExp=RegExp(xExp);
		if (y.match(xExp)!=null) return true; 
		return false
	}
	function pruefeloesungAny(x,y) {
		var xs = x.split(/[;,]\s*/); 
		for (var xi in xs) { 
			//alert(xs[[xi]])
			//alert(o.value+"?="+wort.de[0].w + pruefeloesung(o.value,wort.de[0].w));
			if (pruefeloesungOne(xs[[xi]],y)) {return true}
			//if (y==xs[[xi]]) {alert(xs[[xi]]);return true}
		}
		return false
	}
	function abfragepause(){
		abfragepausiert=true;
		showTable("tabInfo");
	//	tout = setTimeout(abfragecontinue, 3000);
		// clearTimeout(tout)
		//abfragen();
	}
	function abfragecontinue(){ 
    console.log("abfragecontinue");
		clearTimeout(tout)
		abfragepausiert=false;
		document.getElementById("ausgabe").querySelector("#inabfrageantwort").style.backgroundColor="";
		document.getElementById("outabfragerowHinweis").parentNode.style.display="none";
		document.getElementById("hintabfrageantwort").innerHTML="";
		document.getElementById("outabfragehinweis").innerHTML="";
		abfragehinweis=0;
		abfrageversuch=1;
		abfragespoiled=false;
		if (worti<wortperm.length) { console.log("weiterabfragen - worti:" + worti+ "wortperm-length:"+wortperm.length);
			hideTable("tabInfo");
			abfragen();
		} else { console.log("abfragebeenden");
			abfragebeenden(); //hideTable("tabAbfrage")
		}
	}
	function pruefen(o) {
		var containerOut = document.getElementById("ausgabe"); 
		if	(o==null) var o =containerOut.querySelector("#inabfrageantwort");
		
		var wort = aworte[[wortperm[worti]]];
	    var s = o.value;
		var w=wort.deW;
		if (wort.typ=="Substantiv") {
		  w=formatREArtikel(w);
		  }
		 w=formatDots(w);
		if (pruefeloesungAny(w,s)) {
      /*
      const index = array.indexOf(5);
if (index > -1) {
  array.splice(index, 1);
}
      */
      // checke zuerst den Fall, dass das Wort vorher schon Falsch beantwortet wurde
      const index = fantworten_ind.indexOf(wortperm[worti]);
      if (index > -1) {
        //fantworten_ind.splice(index, 1);
        fantworten_ind = fantworten_ind.filter(function(item) {
            return item !== wortperm[worti]
        })
      //  uantworten.push(wort);
				uantworten_ind.push(wortperm[worti]);
        var li_div = $("#inAntwortenResultUnsicher");
      } else if (abfragehinweis+abfrageversuch<=1) {
			//	rantworten.push(wort);
				rantworten_ind.push(wortperm[worti]);
        
        var li_div = $("#inAntwortenResultAufAnhieb");
			} else {
			//	uantworten.push(wort);
				uantworten_ind.push(wortperm[worti]);
        
        var li_div = $("#inAntwortenResultUnsicher");
			}
			ergRichtig(true);
		} else {
			if (abfrageversuch<3&&abfragespoiled==false) {
        console.log("abfrageversuch"+abfrageversuch);
				abfrageversuch+=1;
				document.getElementById("tabAbfrage").querySelector("#hintabfrageantwort").innerHTML=abfrageversuch+". Versuch";
			} else {
        console.log("pruefen: fail")
		//	fantworten.push(wort);
			fantworten_ind.push(wortperm[worti]);
        // Wort nochmal am Ende fragen
			  wortperm.push(wortperm[worti]);
        
        var li_div = $("#inAntwortenResultNichtGewusst");
			  showTable("tabInfo");
			}
			ergRichtig(false);
			
		}
		/*if (sel!=null) {
		var opt = document.createElement('option');
		opt.appendChild( document.createTextNode(wort.ltW) );
		opt.value = wortperm[worti]; 
		sel.appendChild(opt); 
		worti +=1;
		abfragepause();
		}*/
    // neue variante mit neuem select
		if (li_div!=null) { // Bedingung evtl ändern: (abfrageversuch<3+1&&abfragespoiled==false)
  //    var opt = getVocListItem(wort);
 //     li_div.append(opt);
		worti +=1;
		abfragepause();
		}
	}
	
	function abfragebeenden() {
    // Wörter in Ergrbnistab füllen
    var li_div = $("#inAntwortenResultAufAnhieb");
    rantworten_ind.forEach(function(i) {
      var opt = getVocListItem(aworte[[i]]);
      li_div.append(opt);      
    });
    var li_div = $("#inAntwortenResultUnsicher");
    uantworten_ind.forEach(function(i) {
      var opt = getVocListItem(aworte[[i]]);
      li_div.append(opt);      
    });
    var li_div = $("#inAntwortenResultNichtGewusst");
    fantworten_ind.forEach(function(i) {
      var opt = getVocListItem(aworte[[i]]);
      li_div.append(opt);      
    });
    
    
		document.getElementById("tabAbfrage").style.display="none";
		document.getElementById("tabErgebnis").style.display="";
	}
	
	function lektionenauswahl() {
		hideTables();
		hideTable("tabErgebnis");
		showTable("tabVokabelliste");
	}
	
	function pruefenweiter() {
		var containerOut = document.getElementById("tabAbfrage"); 		
		if (abfragepausiert==true) {
			//containerOut.querySelector("#bpruefenabfragebuttons").textContent="Prüfen";
      containerOut.querySelector("#bpruefenabfragebuttons").value="Prüfen";
			abfragecontinue();
		} else {
			//containerOut.querySelector("#bpruefenabfragebuttons").textContent="Weiter";
			containerOut.querySelector("#bpruefenabfragebuttons").value="Weiter";
			pruefen();
		}
	}
	
	function zeigeloesung() {
		abfragespoiled=true;
		document.getElementById("tabAbfrage").querySelector("#bpruefenabfragebuttons").value="Weiter"; //.textContent="Weiter";
		document.getElementById("tabAbfrage").querySelector("#hintabfrageantwort").innerHTML=""; 
		var o={value:""};
		document.getElementById("bpruefenabfragebuttons").focus();	//inabfrageantwort
		pruefen(o);
	}
	
	function ausgeben(stamm, dekID, nominativ,praesstamm,perfstamm,ppp,pfa, pstamm, bindung, istUnpersoenlich) { 
		var deklination = Deklinationen.filter(item => {
			return item.id === dekID;
		});
		
		var s, container,
				prop; 
		
		if (!stamm) stamm="";
		
		// Verb wird konjugiert:
		if (dekID=="are" | dekID=="ire" | dekID=="ere,ui" | dekID=="ere,kon" | dekID=="ere,gem" | dekID=="esse" | dekID=="posse") {
			// Ausgabe-Container sichtbar machen
			var containerImp, containerOut, containerInf, containerPartizip;
			containerOut = document.getElementById("ausgabe"); //
			container = document.getElementById("tabKonjugationen");
			container.style.display="";
			containerImp = document.getElementById("tabImperative");
			containerImp.style.display="";
			containerInf = document.getElementById("tabInfinitive");
			containerInf.style.display="";
			containerPartizip = document.getElementById("tabPartizipien");
			containerPartizip.style.display="";
			//Container benennen
			if (containerImp) containerImp.caption.innerHTML =  "Imperative";
			if (containerInf) containerInf.caption.innerHTML =  "Infinitive";
			if (containerPartizip) containerPartizip.caption.innerHTML =  "Partizipien & Gerundivum";
			if (container) container.caption.innerHTML = deklination[0]["Deklination"];

			// Verben:
			if (container) {
				for (var modus in deklination[0]["Formen"][0]) {
					for (var tempus in deklination[0]["Formen"][0][modus][0]) { 
						for (var genus in deklination[0]["Formen"][0][modus][0][tempus][0]) {
							for (var numerus in deklination[0]["Formen"][0][modus][0][tempus][0][genus][0]) {
								for (var person in deklination[0]["Formen"][0][modus][0][tempus][0][genus][0][numerus][0]) {
									//tempus = tempus.replace("Futur I","Futu1");
									//tempus = tempus.replace("Futur II","Futu2");
									if (istUnpersoenlich==true && genus=="Passiv" && (!(numerus=="Singular"&&person=="3"))) {
										s="-";  
									} else {
									s = deklination[0]["Formen"][0][modus][0][tempus][0][genus][0][numerus][0][person];
									}
									s = tagLatin(stamm+repstamm(s,praesstamm,perfstamm,ppp,pfa, pstamm, bindung));
									if (s.includes("NOPPP")|s.includes("NOPFA")) { 
										containerOut.querySelector("#outVerb" + person + numerus.substr(0,4) + modus.substring(0,3) + tempus.substring(0,5) + genus.substring(0,3) ).innerHTML="-";										
									} else {
										if (containerOut.querySelector("#outVerb" + person + numerus.substr(0,4) + modus.substring(0,3) + tempus.substring(0,5) + genus.substring(0,3) )==null) alert("#outVerb" + person + numerus.substr(0,4) + modus.substring(0,3) + tempus.substring(0,5) + genus.substring(0,3) ); //soll nicht passieren
										containerOut.querySelector("#outVerb" + person + numerus.substr(0,4) + modus.substring(0,3) + tempus.substring(0,5) + genus.substring(0,3) ).innerHTML=s;
										
									}
								}
							}								
						}						
					}
				}
				for (var zeit in deklination[0]["Infinitive"][0]) {
					for (var genus in deklination[0]["Infinitive"][0][zeit][0]) {
						s = deklination[0]["Infinitive"][0][zeit][0][genus];					
						s = tagLatin(repstamm(s,praesstamm,perfstamm,ppp,pfa, pstamm, bindung));
						if (containerInf) {
							if (s.includes("NOPPP")|s.includes("NOPFA")) {
								containerInf.querySelector("#outVerb" + zeit + genus.substring(0,3) ).innerHTML="-";
							} else {
								containerInf.querySelector("#outVerb" + zeit + genus.substring(0,3) ).innerHTML=s;
							}
						}
					}
				}
				for (var partizip in deklination[0]["Partizip"][0]) {
					if (partizip=="PPP"|partizip=="PFA"|partizip=="PPA"|partizip=="Gerundivum")
					for (var genus in deklination[0]["Partizip"][0][partizip][0]) {
						for (var numerus in deklination[0]["Partizip"][0][partizip][0][genus][0]) {
							for (var kasus in deklination[0]["Partizip"][0][partizip][0][genus][0][numerus][0]) {
								s = deklination[0]["Partizip"][0][partizip][0][genus][0][numerus][0][kasus];					
								s = tagLatin(repstamm(s,praesstamm,perfstamm,ppp,pfa, pstamm, bindung));
								if (containerPartizip) { 
									if (s.includes("NOPPP")|s.includes("NOPFA")) {
										containerPartizip.querySelector("#outVerb" + partizip.substring(0,3) + numerus.substring(0,4) + kasus.substring(0,3) + genus ).innerHTML="-";
									} else {
										containerPartizip.querySelector("#outVerb" + partizip.substring(0,3) + numerus.substring(0,4) + kasus.substring(0,3) + genus ).innerHTML=s;
									}
								}
							}
						}
					}
				}
			}
			// Adjektiv wird dekliniert:
		} else if (dekID=="us,a,um"|dekID=="is,is,e"|dekID=="_,is,e"|dekID=="ns,ntis"|dekID=="x,cis"|dekID=="_,_is") {
			container = document.getElementById("tabDeklinationenAdj");
			container.style.display="";

			if (container) {
				container.caption.innerHTML = deklination[0]["Deklination"];
				
				//deklination[0]["Formen"][0].forEach(function (n, j) {
				//	alert(n);
				//});
				for (var genus in deklination[0]["Formen"][0]) {
					deklination[0]["Formen"][0][genus].forEach(function (m, i) {
						for (prop in m["Kasus"]) {
							if (m["Kasus"][prop]=="*") {
								container.querySelector("#out" + "Adj" + m["Numerus"].substr(0,4) + prop.substring(0,3) + genus ).innerHTML=tagLatin(nominativ);
							} else {
								container.querySelector("#out" + "Adj" + m["Numerus"].substr(0,4) + prop.substring(0,3) + genus ).innerHTML=tagLatin(stamm+m["Kasus"][prop]);
							}
						}
					});						
				}
			}
			
		} else if (dekID=="qui/quae/quod"|dekID=="is/ea/id"|dekID=="hic/haec/hoc") {
			container = document.getElementById("tabDeklinationenPron");
			container.style.display="";

			if (container) {
				container.caption.innerHTML = deklination[0]["Deklination"];//"Relativpronomen";
				// [0].Formen[0].M[0].Singular[0].Ablativ
				for (var genus in deklination[0].Formen[0]) { 
					for (var numerus in deklination[0].Formen[0][genus][0]) { 
					//deklination[0]["Formen"][0][genus].forEach(function (m, i) {
						for (var kasus in deklination[0].Formen[0][genus][0][numerus][0]) {
							//if (m["Kasus"][prop]=="*") {
							//	container.querySelector("#out" + "Pron" + m["Numerus"].substr(0,4) + prop.substring(0,3) + genus ).innerHTML=tagLatin(nominativ);
							//} else {
								var outtxt = deklination[0].Formen[0][genus][0][numerus][0][kasus]; 
								container.querySelector("#out" + "Pron" + numerus.substr(0,4) + kasus.substring(0,3) + genus ).innerHTML=tagLatin(outtxt);
							//}
						}
					}//);						
				}
			}
			
		} else if (dekID=="ego/mei/mihi") {
			container = document.getElementById("tabDeklinationenReflPersPron");
			container.style.display="";

			if (container) {
				container.caption.innerHTML = deklination[0]["Deklination"];//"Relativpronomen (reflexiv)";//
				// [0].Formen[0].M[0].Singular[0].Ablativ
				for (var genus in deklination[0].Formen[0]) { 
					for (var numerus in deklination[0].Formen[0][genus][0]) { 
					//deklination[0]["Formen"][0][genus].forEach(function (m, i) {
						for (var kasus in deklination[0].Formen[0][genus][0][numerus][0]) {
							//if (m["Kasus"][prop]=="*") {
							//	container.querySelector("#out" + "Pron" + m["Numerus"].substr(0,4) + prop.substring(0,3) + genus ).innerHTML=tagLatin(nominativ);
							//} else {
								var outtxt = deklination[0].Formen[0][genus][0][numerus][0][kasus]; 
								container.querySelector("#out" + "Pron" + numerus.substr(0,4) + kasus.substring(0,3) + genus ).innerHTML=tagLatin(outtxt);
							//}
						}
					}//);						
				}
			}
			
		} else { // Nomen/Substantive
			container = document.getElementById("tabDeklinationen");
			container.style.display="";

			if (container) {
				container.caption.innerHTML = deklination[0]["Deklination"];
				
				for (var numerus in deklination[0].Formen) { 
					for (var kasus in deklination[0].Formen[numerus]) { 
						container.querySelector("#out" +"Nom" + numerus.substr(0,4) + kasus.substr(0,3)).innerHTML=tagLatin(stamm+deklination[0].Formen[numerus][kasus]);
					}
				}
			}
		}
	}
  
	function deklinationAusgeben(stamm, dekID, wort, nominativ) { 
	var deklination = Deklinationen.filter(item => {
		return item.id === dekID;
	});
	
	//nur für substantive, nicht für adjektive
	if (wort["nursingular"]!=null) if (wort["nursingular"]=="1")   var formen = patchFlektion(deklination[0]["Formen"],noplurDeklination);
	if (wort["nurplural"]!=null) if (wort["nurplural"]=="1")   var formen = patchFlektion(deklination[0]["Formen"],nosingDeklination);
	if (formen==null) var formen=deklination[0]["Formen"];
	
	if (wort["flektion"]!=null) var formen = patchFlektion(deklination[0]["Formen"],wort["flektion"]);
	
	var deklinationTxt = deklination[0]["Deklination"];
	if (wort.flektion!=null) if (wort.flektion.name!=null) {
		var deklinationTxt = wort.flektion.name;
	} 
	//wortliste5[11][0].lt[0]["nurplural"]
	//var formen = patchFlektion(deklination[0]["Formen"],nosingDeklination);
	
	var s, container,
			prop; 
	
	if (!stamm) stamm="";
	if (dekID=="dummy") {
	} if (dekID=="us,a,um"|dekID=="is,is,e"|dekID=="_,is,e"|dekID=="ns,ntis"|dekID=="x,x,x,cis,cic,cis"|dekID=="_,_is") {
			container = document.getElementById("tabDeklinationenAdj");
			container.style.display="";

			if (container) {
				container.caption.innerHTML = deklinationTxt;
				
				for (var genus in formen) {
					for (var numerus in formen[genus]) {
						for (var kasus in formen[genus][numerus]) { 
							if (formen[genus][numerus][kasus]==tagLatin("")) { //KANN WEG
								container.querySelector("#out" + "Adj" + numerus.substr(0,4) + kasus.substring(0,3) + genus ).innerHTML="";
							} else if (formen[genus][numerus][kasus]=="*") {
								container.querySelector("#out" + "Adj" + numerus.substr(0,4) + kasus.substring(0,3) + genus ).innerHTML=tagLatin(nominativ);
							} else {
								container.querySelector("#out" + "Adj" + numerus.substr(0,4) + kasus.substring(0,3) + genus ).innerHTML=tagLatin(rpDekStamm(formen[genus][numerus][kasus],stamm));
							}
						}
					}						
				}
			}
			
		} else if (dekID=="quis/quid") { 
			container = document.getElementById("tabDeklinationenPron");
			container.style.display="";

			if (container) {
				container.caption.innerHTML = deklinationTxt;//"Interrogativpronomen";
				
				for (var genus in formen) { 
					for (var numerus in formen[genus]) { 
						for (var kasus in formen[genus][numerus]) {
							if (formen[genus][numerus][kasus]==tagLatin("")) {//KANN WEG
								container.querySelector("#out" + "Pron" + numerus.substr(0,4) + kasus.substring(0,3) + genus ).innerHTML="";
							} else if (formen[genus][numerus][kasus]=="*") {
								container.querySelector("#out" + "Pron" + numerus.substr(0,4) + kasus.substring(0,3) + genus ).innerHTML=tagLatin(nominativ);
							} else { 
								container.querySelector("#out" + "Pron" + numerus.substr(0,4) + kasus.substring(0,3) + genus ).innerHTML=tagLatin(formen[genus][numerus][kasus]);
							}
						}
					}						
				}
			}
			
		} else { // Nomen/Substantive
		container = document.getElementById("tabDeklinationen");
		container.style.display="";

			if (container) {
				container.caption.innerHTML = deklinationTxt;
				
				for (var numerus in formen) { 
					for (var kasus in formen[numerus]) { 
						if (formen[numerus][kasus]==tagLatin("")) {//KANN WEG
							container.querySelector("#out" +"Nom" + numerus.substr(0,4) + kasus.substr(0,3)).innerHTML="";
						} else if (formen[numerus][kasus]=="*") {
							container.querySelector("#out" +"Nom" + numerus.substr(0,4) + kasus.substr(0,3)).innerHTML=tagLatin(nominativ);
						} else {
							container.querySelector("#out" +"Nom" + numerus.substr(0,4) + kasus.substr(0,3)).innerHTML=tagLatin(rpDekStamm(formen[numerus][kasus],stamm));
						}
					}
				}
				//deklination[0]["Formen"].forEach(function (m, i) { 
						//for (prop in m["Kasus"]) {
					//	container.querySelector("#out" +"Nom" + m["Numerus"].substr(0,4) + prop.substr(0,3)).innerHTML=tagLatin(stamm+m["Kasus"][prop]);
					//}
				//});
			}
		}
	}
	
	function selDeklinieren(el) {
    //console.log(el);
    //console.log(el.attr('value'));
		var i = el.attr('value'); //el.selectedIndex;
    
    var vokRs = leseVokabel(i, printWortinfo);
    var nada = leseVokabel(i, getWortstamm);
    // hole ausgewählten Wortschatz in wlist
		//var sel = document.getElementById("inVokabelnLektionen");
		//var wlist = window[sel.options[sel.selectedIndex].value];
    //
    //benutze einfach wortliste
  //  window.wlist=wortliste;
 //   console.log(wortliste);
 //   console.log(wortliste.find(x => x.id === i)); 
    console.log("cp1")
		
		hideTables();
		showTable("tabInfo");
		//wliste[i][0].lt[0].mit
//	  getWortstamm(el.options[i].text, wlist[i][0]);
	//  printWortinfo(el.options[i].value, wlist)
	}

	function selectVokabel(el) {
		var i = el.attr("value"); //el.selectedIndex;
	//	var s = el.options[i].text;
	//	var spl = s.split(/[ ,]+/); 
	//	var spl1 = spl[0];
		//var sel = document.getElementById("inVokabelnLektionen");
		var wlist = window[sel.options[sel.selectedIndex].value] 
		
		/*document.getElementById("fAntwortenSelect").selectedIndex=-1;
		document.getElementById("lAntwortenSelect").selectedIndex=-1;
		document.getElementById("rAntwortenSelect").selectedIndex=-1;
		el.selectedIndex=i;*/
		
		hideTables();
		showTable("tabInfo");
		//wliste[i][0].lt[0].mit
	  getWortstamm(el.attr("latin"), wlist[i][0]); //getWortstamm(el.options[i].text, wlist[i][0]);
    
	  printWortinfo(i, wlist) //printWortinfo(el.options[i].value, wlist)
	}


function hideEl(el) {
  el.style.display = 'none';
}

function showEl(el) {
  el.style.display = '';
}

function opMenu(el) { 
  console.log("opMenu");
  console.log("...");
  console.log("....");
  console.log("..");
  el.parentElement.getElementsByTagName("ul")[0].style.visibility='visible';
}


function selModus(el, mod) {
  // hide menu
  if (el== null)  return
  if (mod== null)  return
    
  el.parentElement.parentElement.style.visibility='hidden';
  var kTab = el.closest("table");
  
  // select coloumns
  if (mod=="Aktiv") {
      kTab.querySelectorAll('td[col="5"], td[col="6"]').forEach(element => hideEl(element));
      kTab.querySelectorAll('td[col="3"], td[col="4"]').forEach(element => showEl(element));
  } else if (mod=="Passiv") {
      kTab.querySelectorAll('td[col="3"], td[col="4"]').forEach(element => hideEl(element));
      kTab.querySelectorAll('td[col="5"], td[col="6"]').forEach(element => showEl(element));

    }
}
function selGenus(el, mod) {
  // hide menu
  if (el== null)  return
  if (mod== null)  return
    
  el.parentElement.parentElement.style.visibility='hidden';
  var kTab = el.closest("table");
  
  // select coloumns
  if (mod=="M") {
      //kTab.querySelectorAll('td[col="4"], td[col="5"]').forEach(element => hideEl(element));
      //kTab.querySelectorAll('td[col="3"]').forEach(element => showEl(element));
      kTab.querySelectorAll('td[genus="F"], td[genus="N"]').forEach(element => hideEl(element));
      kTab.querySelectorAll('td[genus="M"]').forEach(element => showEl(element));
  } else if (mod=="F") {
     // kTab.querySelectorAll('td[col="3"], td[col="5"]').forEach(element => hideEl(element));
     // kTab.querySelectorAll('td[col="4"]').forEach(element => showEl(element));
    
      kTab.querySelectorAll('td[genus="M"], td[genus="N"]').forEach(element => hideEl(element));
      kTab.querySelectorAll('td[genus="F"]').forEach(element => showEl(element));

    } else if (mod=="N") {
     // kTab.querySelectorAll('td[col="3"], td[col="4"]').forEach(element => hideEl(element));
     // kTab.querySelectorAll('td[col="5"]').forEach(element => showEl(element));
      
      kTab.querySelectorAll('td[genus="F"], td[genus="M"]').forEach(element => hideEl(element));
      kTab.querySelectorAll('td[genus="N"]').forEach(element => showEl(element));
    }
}

function selTempus(el, tempus) {
  // hide menu
  el.parentElement.parentElement.style.visibility='hidden';
  
  var kTab = el.closest("table");
  // select rows
      kTab.querySelectorAll('tr[row]:not([row="'+tempus+'"],[row="empty1"],[row="colTempus"])').forEach(element => hideEl(element));
  kTab.querySelectorAll('tr[row="'+tempus+'"]').forEach(element => showEl(element));
 //   var tempus="rowPraesens"; //kTab.querySelectorAll('tr[row="'+tempus+'"]').forEach(element => showEl(element));
}

function selPartizip(el, sel) {
  // hide menu
  el.parentElement.parentElement.style.visibility='hidden';
  
  var kTab = el.closest("table");
  // select rows
      kTab.querySelectorAll('tr[row]:not([row="'+sel+'"],[row="empty1"],[row="empty"],[row="colTempus"])').forEach(element => hideEl(element));
  kTab.querySelectorAll('tr[row="'+sel+'"]').forEach(element => showEl(element));
 //   var sel="rowPraesens"; //kTab.querySelectorAll('tr[row="'+sel+'"]').forEach(element => showEl(element));
}
  
  	document.addEventListener(
		"DOMContentLoaded",
		function () { init(); 
                addEventListeners();}
	);
  
  function openDb() {
    console.log("openDb ...");
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function (evt) {
      db = this.result;  // Equal to: db = req.result;
      console.log("openDb DONE");
      
      displayVocList();
      updateInputList();
    };
    req.onerror = function (evt) {
      console.error("openDb:", evt.target.errorCode);
    };

    req.onupgradeneeded = function (evt) {
      console.log("openDb.onupgradeneeded");
      
      db = req.result;
      var storeVocList = evt.currentTarget.result.createObjectStore(
        DB_STORE_UNITS, { autoIncrement: true });
      storeVocList.createIndex('name', '', { unique: false });
            // oncomplete to make sure the objectStore creation is finished
      storeVocList.transaction.oncomplete = function(event) {
        console.log("storeVocList.transaction.oncomplete  never happens?");
      }
      
      var store = evt.currentTarget.result.createObjectStore(
        DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      //store.createIndex('biblioid', 'biblioid', { unique: true });
      store.createIndex('ltW', 'ltW', { unique: false });
      store.createIndex('deW', 'deW', { unique: false });
      store.createIndex('lVoc', 'lVoc', { unique: false });
      store.createIndex('typ', 'typ', { unique: false });
      store.transaction.oncomplete = function(event) { 
        console.log("store.transaction.oncomplete");
        
        var lektionenObjectStore = db.transaction(DB_STORE_UNITS, "readwrite").objectStore(DB_STORE_UNITS);
        for (var i = 1; i <= 18; i++) {
          lektionenObjectStore.add("Lektion "+i);
        }
                          
        // Store values in the newly created objectStore.
        var customerObjectStore = db.transaction(DB_STORE_NAME, "readwrite").objectStore(DB_STORE_NAME);
        var allvok = [lektion1a,lektion1b,lektion2,lektion3,lektion4,wortliste5,wortliste6,wortliste7,wortliste8,wortliste9,wortliste10,wortliste11,wortliste12,wortliste13,wortliste14,wortliste15,wortliste16,wortliste17,wortliste18]; 
        var i = 1;
        allvok.forEach(function(ws) {
              ws.forEach(function(customer) {
                customer.lVoc = "Lektion "+i;
                customerObjectStore.add(customer);
              });
                i=i+1;
          });
        
        
      };
      console.log("openDb.onupgradefinished");
    };
  }
  /**
   * @param {string} store_name
   * @param {string} mode either "readonly" or "readwrite"
   */
  function getObjectStore(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
  }

  function clearObjectStore() {
    var store = getObjectStore(DB_STORE_NAME, 'readwrite');
    var req = store.clear();
    req.onsuccess = function(evt) {
      displayActionSuccess("Store cleared");
      displayVocList(store);
      updateInputList(store);
    };
    req.onerror = function (evt) {
      console.error("clearObjectStore:", evt.target.errorCode);
      displayActionFailure(this.error);
    };
  }
  function getBlob(key, store, success_callback) {
    var req = store.get(key);
    req.onsuccess = function(evt) {
      var value = evt.target.result;
      if (value)
        success_callback(value.blob);
    };
  }
  function updateInputList(store) {
    console.log("updateInputList");
    
    if (typeof store == 'undefined')
      store = getObjectStore(DB_STORE_NAME, 'readonly');
    // zähle Anzahl Vokabeln
    var req;
    req = store.count();
    req.onsuccess = function(evt) {
      // zähle Anzahl Lektionen
      const result = [];
      store.index("lVoc").openKeyCursor(null,"nextunique").onsuccess = (event) => {
          var cursor = event.target.result;
          if (cursor) {
              // cursor.key is index key, cursor.primaryKey is primary key,  // cursor.value is undefined because openKeyCursor, not openCursor.
              result.push(cursor.key);
              cursor.continue();
          } else {
            // sortiere Lektionen
            var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
            result.sort(collator.compare);
                    
            $('#msg').html('');
            var voc_msg = $('#voc-msg');
            voc_msg.html('<p>Es sind <strong>' + evt.target.result +
                           '</strong> Vokabeln in <strong>'+ result.length +'</strong>  Lektionen in der Datenbank.</p>');  
            
            //voc liste zufügen?
            var voc_list = $('#voc-list');
            //voc_list.empty();
            //remember Lektion
            var rememberLektion = voc_list.attr("value");
            voc_list.html('<option value=""></option><option value="neu">Neue Lektion... </option>');
            
            $('#ulVokabelnLektionen').empty();
            
            console.log("updateInputList empty voclist");
            
            result.forEach(function(lektion) {
              //Lektionsauswahl für Editor
              var op = document.createElement('option');
              op.innerHTML = lektion;
              op.setAttribute("value",lektion);
              // Lektionsauswahl an ulVokabelnLektionen zufügen
              var li = document.createElement('li');
              li.innerHTML = lektion;
              $(li).click(function(event){
                console.log("liclick");
                var item = $(event.currentTarget);
                var selVals = $('#inVokabelnLektionen').attr("value"); 
                var selValSet = new Set(selVals.split("\n"));

                if (!event.shiftKey) {
                  // li attribute only for curr item selected
                  item.siblings().removeClass('selected');
                  item.addClass('selected');

                  // input attribute
                  selValSet.clear();
                  selValSet.add(this.innerHTML);
                } else {
                  // li attribute - toggle curr item selected
                  item.toggleClass('selected'); //

                  // input attribute
                  //if ($(item).hasClass( "selected" )) {
                  if (!selValSet.has(this.innerHTML)) {
                    // add to selected
                    selValSet.add(this.innerHTML);
                  } else {
                    //remove from selected
                    selValSet.delete(this.innerHTML);
                  }
                }
                console.log(selValSet);
                $('#inVokabelnLektionen').attr("value",[...selValSet].join('\n'));
                console.log($('#inVokabelnLektionen').attr("value"));
                displayVocList();
                });   

                $('#ulVokabelnLektionen').append(li);
                voc_list.append(op);
            });
            voc_list.attr("value", rememberLektion);
          }
      };
    };
    req.onerror = function(evt) {
      console.error("add error", this.error);
      displayActionFailure(this.error);
    }; 
  }
  function setEditorInputs(item) {
            $('#active-key').val(item.attr("value")); // Number(item.attr("value"))
            $('#voc-lat').val(item.attr("ltw"));
            $('#voc-deu').val(item.attr("dew"));
            $('#voc-typ').val(item.attr("typ"));
            $('#voc-typ2').val(item.attr("typ"));
            if (mainvoctypes.includes(item.attr("typ"))) {
              $('#voc-typ2').hide();
            } else {
              $('#voc-typ2').show();
            }
            $('#voc-comment').val(item.attr("ltcom"));
            $('#voc-decom').val(item.attr("decom"));
            $('#voc-list').val(item.attr("lVoc"));
            $('#voc-list2').val(item.attr("lVoc"));
            $('#voc-list2').hide();
    
            $('#verb_unpers_check').prop("checked", item.attr("pass")=="3.Sg")
    console.log("pass3Sg?:"+item.attr("pass"));

            // show image?
            setInViewer(item.attr("value"));
  }
  function getVocListItem(value) {    
          var vlist_item = $('<li><div><table cellspacing="0"><tr><td width="50%" valign="top">' + value.ltW + '</td><td width="15px"></td><td width="50%" valign="top">' +
                             value.deW +
                             '</td></tr></table></div></li>');

          vlist_item.attr("value", value.id);
          vlist_item.attr("ltW", value.ltW);
          vlist_item.attr("deW", value.deW);
          vlist_item.attr("typ", value.typ);
          vlist_item.attr("pass", value.pass);
          vlist_item.attr("lVoc", value.lVoc);
          vlist_item.attr("deCom", value.deCom);
          vlist_item.attr("ltCom", value.ltCom);
          vlist_item.attr("ltG", value.ltG);
          // focusable, but not using tab:
          vlist_item.attr("tabindex", "-1");
          // navigate by up and down
          vlist_item.keydown(function(e) {
              if (e.keyCode == 38) { // up
                  var selected = $(this);
                  $(this).removeClass("selected"); // unselect this
                  $(this).siblings().removeClass("selected"); // unselect siblings
                  if (selected.prev().length == 0) {
                      if (selected.parent().prevAll().find("li").length==0) {
                        // springe zu letztem Abschnitt, letzter Eintrag
                        selected.parent().nextAll().find("li").last().addClass("selected");
                        selected.parent().nextAll().find("li").last().focus();
                        var item = selected.parent().nextAll().find("li").last();
                      } else { // springe zu vorigem Abschnitt, letzter Eintrag
                        selected.parent().prevAll().find("li").first().siblings().addBack().last().addClass("selected");
                        selected.parent().prevAll().find("li").first().siblings().addBack().last().focus();
                        var item = selected.parent().prevAll().find("li").first().siblings().addBack().last();
                      }
                  } else {
                      selected.prev().addClass("selected");
                      selected.prev().focus();  // {preventScroll:true} geht nicht??
                      var item = selected.prev();
                  }
                // show image?
                setEditorInputs(item); //setInViewer(item.attr("value"));
                 // Deklinationstabelle?
                 selDeklinieren(item);
                return false;
              }
              if (e.keyCode == 40) { // down
                  var selected = $(this);
                  $(this).removeClass("selected"); // unselect this
                  $(this).siblings().removeClass("selected"); // unselect siblings
                  if (selected.next().length == 0) { 
                      if (selected.parent().nextAll().find("li").length==0) {
                        selected.parent().prevAll().find("li").last().siblings().addBack().first().addClass("selected");
                        selected.parent().prevAll().find("li").last().siblings().addBack().first().focus();
                        var item = selected.parent().prevAll().find("li").last().siblings().addBack().first();
                        
                      } else { //experiment
                        selected.parent().nextAll().find("li").first().addClass("selected");
                        selected.parent().nextAll().find("li").first().focus();
                        var item = selected.parent().nextAll().find("li").first();
                      }
                  } else { // nach unten innerhalb gleichem Abschnitt
                      selected.next().addClass("selected");
                      selected.next().focus();
                      var item = selected.next();
                  }
                
                // show image?
                //setInViewer(item.attr("value"));
                setEditorInputs(item)
                 // Deklinationstabelle?
                 selDeklinieren(item);
                return false;
              }
          });
          // clicks for list elements
          vlist_item.click(function(event){
            var item = $(event.currentTarget);
            item.addClass('selected');
            // siblings und cousins deselektieren
            item.siblings().removeClass('selected');
            item.siblings().parent().prevAll().find("li").removeClass("selected")
            item.siblings().parent().nextAll().find("li").removeClass("selected")
            //$('#'+item.closest(".select").attr("inputid")).val(item.text());
       //     selectVokabel(item); 
            setEditorInputs(item)
             // Deklinationstabelle?
             selDeklinieren(item); //this  item.attr("ltw")     
    });

    return vlist_item;
  }
  
  function displayVocList(store) {
    console.log("displayVocList");

    if (typeof store == 'undefined')
      store = getObjectStore(DB_STORE_NAME, 'readonly');

    var voc_list = $('#ulVokabelnVokabeln');
    wortliste = [];
    voc_list.empty();
    // Resetting the iframe, clear previous content
    var delURL = document.querySelector('#testImage').getAttribute("src");
    window.URL.revokeObjectURL(delURL);
    document.querySelector('#testImage').setAttribute("src","");

    var i = 0;
      //set for cursor filter
  //    if ($('#inVokabelnLektionen').length==1) {
      var selVals = $('#inVokabelnLektionen').attr("value"); 
      var selValSet = new Set(selVals.split("\n"));
      var selSort = Array.from(selValSet).sort();
    
    if (selValSet.size==1 & selValSet.has("")) {
      var empty_item = $('<li>keine Lektion ausgewählt</li>');
      voc_list.append(empty_item);
      console.log("updatevoclist:keine Lektion empty");
    }
        
    var req;
    var vocbin = [];
    
    selSort.forEach(function(key) {
      vocbin[key] = [];
      
    req = store.index("lVoc").openCursor(key);
    req.onsuccess = function(evt) {
      var cursor = evt.target.result;
      // If the cursor is pointing at something, ask for the data
      if (cursor) { // & selValSet.has(cursor.key)
        var value = cursor.value;
        var vlist_item = getVocListItem(value);
        wortliste.push(value);
        vocbin[key].push(vlist_item)
        cursor.continue();
        i++; // counter to create distinct ids
      } else {
        selSort.forEach(function(akey) {
          voc_list.append(vocbin[akey]);
        }); 
      }
    };
    })
  }
  
  function setInViewer(key) {
    console.log("setInViewer:", arguments);
    
    // altes Bild löschen
    var delURL = document.querySelector('#testImage').getAttribute("src");
    window.URL.revokeObjectURL(delURL);
    document.querySelector('#testImage').setAttribute("src","");
    
    key = Number(key);

    var store = getObjectStore(DB_STORE_NAME, 'readonly');
    getBlob(key, store, function(blob) { 
      console.log("setInViewer blob:", blob);
      
      if (blob===null || typeof blob === 'undefined') {
        console.log("no blob");
        return;
      }
      
      if (blob.type.indexOf('image/') == 0) {
          //$('*').css('cursor', 'wait');
          var obj_url = window.URL.createObjectURL(blob);
        var image = document.querySelector('#testImage');
        image.setAttribute("src", obj_url);
        image.setAttribute("width", "200px");
        //window.URL.revokeObjectURL(obj_url);
      }

    });
  }
  /**
    * @param {string} biblioid
    * @param {string} title
    * @param {number} year
    * @param {Blob=} blob
    */
  function neueVokabel(latein, deutsch, wortart, genus, lKommentar, dKommentar, lektion, blob, key) {
    console.log("neueVokabel arguments:", arguments);
    var obj = { ltW: latein, deW: deutsch, typ: wortart, lVoc:lektion };
    if (!(lKommentar == null))
      obj.ltCom = lKommentar;
    if (!(dKommentar == null))
      obj.deCom = dKommentar;
    if (!(genus == null))
      obj.ltG = genus;
    if (typeof blob != 'undefined')
      obj.blob = blob;

    var store = getObjectStore(DB_STORE_NAME, 'readwrite');
    var req;
    try {
      if (key == null) {
        req = store.add(obj);
      } else {
        obj.id = Number(key);
        req = store.put(obj);
      }
    } catch (e) {
      if (e.name == 'DataCloneError')
        displayActionFailure("This engine doesn't know how to clone a Blob, " +
                             "use Firefox");
      throw e;
    }
    req.onsuccess = function (evt) {
      console.log("Insertion in DB successful");
      displayActionSuccess();
      displayVocList(store);
      updateInputList(store);
    };
    req.onerror = function() {
      console.error("neueVokabel error", this.error);
      displayActionFailure(this.error);
    };
  }
  
  function neueLektion(lektion) {
    console.log("neueLektion arguments:", arguments);

    var store = getObjectStore(DB_STORE_UNITS, 'readwrite');
    var req;
    try {
      req = store.add(lektion);
    } catch (e) {
      if (e.name == 'DataCloneError')
        displayActionFailure("This engine doesn't know how to clone a Blob, " +
                             "use Firefox");
      throw e;
    }
    req.onsuccess = function (evt) {
      console.log("Insertion in DB successful");
      displayActionSuccess();
      displayVocList(store);
      updateInputList(store);
    };
    req.onerror = function() {
      console.error("neueVokabel error", this.error);
      displayActionFailure(this.error);
    };
  }

  function getLektionKey(lektion) {
    console.log("getLektionKey:", arguments);
    var store = getObjectStore(DB_STORE_UNITS, 'readwrite');
    var req = store.index('name');
    req.get(lektion).onsuccess = function(evt) {
      if (typeof evt.target.result == 'undefined') {
        displayActionFailure("No matching record found");
        return;
      }
      alert(evt.target.result.id);
      return evt.target.result.id;
    };
    req.onerror = function (evt) {
      console.error("getLektionKey:", evt.target.errorCode);
    };
  }

  function entferneVokabel(key, store) {
    console.log("entferneVokabel:", arguments);

    if (typeof store == 'undefined')
      store = getObjectStore(DB_STORE_NAME, 'readwrite');

    // As per spec http://www.w3.org/TR/IndexedDB/#object-store-deletion-operation
    // the result of the Object Store Deletion Operation algorithm is undefined
    var req = store.get(key);
    req.onsuccess = function(evt) {
      var record = evt.target.result;
      console.log("record:", record);
      if (typeof record == 'undefined') {
        displayActionFailure("No matching record found");
        return;
      }
      // Warning: The exact same key used for creation needs to be passed for
      // the deletion.
      var deleteReq = store.delete(key);
      deleteReq.onsuccess = function(evt) {
        console.log("evt:", evt);
        console.log("evt.target:", evt.target);
        console.log("evt.target.result:", evt.target.result);
        console.log("delete successful");
        displayActionSuccess("Vokabel entfernt");
        displayVocList(store);
        updateInputList(store);
      };
      deleteReq.onerror = function (evt) {
        console.error("entferneVokabel:", evt.target.errorCode);
      };
    };
    req.onerror = function (evt) {
      console.error("entferneVokabel:", evt.target.errorCode);
    };
  }
  
  function leseVokabel(key, callback, store) {
    console.log("leseVokabel:", arguments);

    if (typeof store == 'undefined')
      store = getObjectStore(DB_STORE_NAME, 'readonly');

    var req = store.get(key);
    req.onsuccess = function(evt) {
      // Do something with the request.result!
      //console.log("deW for the key is " + req.result.deW);
      var record = evt.target.result;
      console.log("record:", record);
      if (typeof record == 'undefined') {
        displayActionFailure("No matching record found");
        return null;
      }
      callback(record);
    };
    req.onerror = function (evt) {
      console.error("leseVokabel:", evt.target.errorCode);
    };
  }

  function displayActionSuccess(msg) {
    msg = typeof msg != 'undefined' ? "Erfolg: " + msg : "Erfolg";
    $('#msg').html('<span class="action-success">' + msg + '</span>');
  }
  function displayActionFailure(msg) {
    msg = typeof msg != 'undefined' ? "Fehler: " + msg : "Fehler";
    $('#msg').html('<span class="action-failure">' + msg + '</span>');
  }
  function resetActionStatus() {
    console.log("resetActionStatus ...");
    $('#msg').empty();
    document.querySelector('#testImage').setAttribute("src","");
  }
  function addEventListeners() {
    console.log("addEventListeners");
    
    //listeners for app handling
    $('#inVokabelnAbfragen').click(function(evt) {
      abfragestart();
    });
    $('#bhinweisabfragebuttons').click(function(evt) {
      newhint();
    });
    $('#bpruefenabfragebuttons').click(function(evt) {
      pruefenweiter();
    });
    $('#bloesungabfragebuttons').click(function(evt) {
      zeigeloesung();
    });
    $('#bbeendenabfragebuttons').click(function(evt) {
      abfragebeenden();
    });   
    $('#inwArtLektionen').click(function(evt) {
      lektionenauswahl();
    });    
    //  Button Neue Vokabel
    $('#register-form-reset').click(function(evt) {
      hideTables();
		hideTable("tabVokabelliste");
      $("#register-form")[0].reset();
      showTable("verb-form-tab");
      resetActionStatus();
    });
    //  Button Bearbeite Vokabel
    $('#edit-voc-button').click(function(evt) {
      hideTables();
		  hideTable("tabVokabelliste");
      showTable("verb-form-tab");
    });
    //  test
    $('#test-button').click(function(evt) {
      opMenu();
    });
    //discard-button
     $('#discard-button').click(function(evt)     {
      hideTable("verb-form-tab");
      showTable("tabVokabelliste");
    });
   

    $('#add-button').click(function(evt) {
      console.log("add ...");
      var latein = $('#voc-lat').val();
      var deutsch = $('#voc-deu').val();
      var wArt = $('#voc-typ2').val();
      var genus = wArt=="Substantiv" ? genus = $('#voc-ltg').val() : null;
      /*if (wArt="Substantiv") {
        genus = $('#voc-ltg').val();
      }*/
      if (!latein || !deutsch) {
        displayActionFailure("Erforderliche Eingabe fehlt");
        return;
      }
      var file_input = $('#img-file');
      var selected_file = file_input.get(0).files[0];
      console.log("selected_file:", selected_file);
      // Keeping a reference on how to reset the file input in the UI once we
      // have its value, but instead of doing that we rather use a "reset" type
      // input in the HTML form.
      //file_input.val(null);
      var ltComment = $('#voc-comment').val() != '' ? $('#voc-comment').val() : null;
      var dtComment = $('#voc-decom').val() != '' ? $('#voc-decom').val() : null;
      var lektion = $('#voc-list2').val();
       if (lektion=="") {
        displayActionFailure("Der Name der Vokabelliste fehlt");
        return;
      }
      if ( $('#voc-list2').val() !=  $('#voc-list').val()) neueLektion(lektion);
      var key = $('#active-key').val();
      if (key == "") key = null; // if isNaN(Number(key))
      if (selected_file) { //latein, deutsch, wortart, genus, lKommentar, dKommentar, blob
        neueVokabel(latein, deutsch,wArt,genus,ltComment,dtComment,lektion, selected_file,key);
      } else { //latein, deutsch, wortart, genus, lKommentar, dKommentar, blob
        neueVokabel(latein, deutsch,wArt,genus,ltComment,dtComment,lektion,null,key);
      }

      //Anzeige aktualisieren
      
      hideTable("verb-form-tab");
      showTable("tabVokabelliste");
    });

    $('#delete-button').click(function(evt) {
      console.log("delete ...");
      var key = $('#active-key').val();

      if (key != '') {
        // Better use Number.isInteger if the engine has EcmaScript 6
        if (key == '' || isNaN(key))  {
          displayActionFailure("Invalid key");
          return;
        }
        key = Number(key);
        entferneVokabel(key);
      }
    });

  }

  openDb();
  //addEventListeners();
})(); // Immediately-Invoked Function Expression (IIFE)
