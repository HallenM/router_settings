$(function(){
	$('#tabs a[href="#web"]').on('show.bs.tab', function () {
		let obj = JSON.parse(sessionStorage.getItem("settings"));
		
		let inputStr = document.getElementById("ssidWeb");
		inputStr.value = obj.ssid;

		inputStr = document.getElementById("chBondingWeb");
		inputStr.value = obj.chBonding;
		showOrHideExtendedCh();

		inputStr = document.getElementById("wpaKeyWeb");
		inputStr.value = obj.wpaKey;

		if (obj.chBonding != "5" && obj.chBonding != "10"){
			if (obj.extendedCh == "true") {
				inputStr = document.getElementById("extendedCh1Web");
				inputStr.checked = true;
			} else if (obj.extendedCh == "false") {
				inputStr = document.getElementById("extendedCh2Web");
				inputStr.checked = true;
			}
		}

		if (obj.useChLim == "true") {
			inputStr = document.getElementById("useChLim1Web");
			inputStr.checked = true;
		} else if (obj.useChLim == "false") {
			inputStr = document.getElementById("useChLim2Web");
			inputStr.checked = true;
		}
		showOrHideChLim();

		inputStr = document.getElementById("addedChannels");
		inputStr.textContent = obj.chLim + " ";

		sessionStorage.removeItem('settings');
	})
})

$(function(){
	$('#tabs a[href="#raw"]').on('hide.bs.tab', function () {
		let settings = {
			ssid: document.getElementById("ssidRaw").value,
			chBonding: document.getElementById("chBondingRaw").value,
			wpaKey: document.getElementById("wpaKeyRaw").value,
			extendedCh: document.getElementById("extendedChRaw").value,
			useChLim: document.getElementById("useChLimRaw").value,
			chLim: document.getElementById("chLimRaw").value
		}

		sessionStorage.setItem("settings", JSON.stringify(settings));
	})
})


function showOrHideExtendedCh(){
	let selectVal = document.getElementById("chBondingWeb").value;
	let extendedCh = document.getElementById("extendedChWithLabel");

	if (selectVal == 5 || selectVal == 10) {		
		extendedCh.style.display = "none";
		document.getElementById("extendedCh1Web").checked = false;
	} else {
		extendedCh.style.display = "block";
		//document.getElementById("extendedCh2Web").checked = false;
	}
	viewChannelEditor();
}

function showOrHideChLim(){
	let radioChLim = document.getElementsByName("useChannelLimit");
	let chLim = document.getElementById("chLimWithLabel");
	
	if (radioChLim[0].checked) {
		chLim.style.display = "block";
		viewChannelEditor();
	} 
	else if (radioChLim[1].checked) {
		chLim.style.display = "none";
	}
}

function viewChannelEditor(){
	let chBonding = document.getElementById("chBondingWeb").value;
	let extendedCh = document.getElementsByName("extendedChannel");
	let listChannels = [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 
	116, 120, 124, 128, 132, 136, 140, 144, 149, 153, 157, 161];

	let allChnls = document.getElementById("allChnl");
	let listChnls = document.getElementById("listChnl");
	let infoView = document.getElementById("infoView");

	if (chBonding == 5 || chBonding == 10) {
		// 36-165 elements
		allChnls.style.display = "block";
		listChnls.style.display = "none";
	} else if (chBonding == 20) {
		infoView.style.display = "block";
		listChnls.style.display = "none";
		allChnls.style.display = "none";

		if (extendedCh[0].checked) {
			// 36-165 elements
			allChnls.style.display = "block";
			listChnls.style.display = "none";
			infoView.style.display = "none";
		} 
		else if (extendedCh[1].checked) {
			listChnls.style.display = "block";
			allChnls.style.display = "none";
			infoView.style.display = "none";

			// listChannels + 165 elements
			listChannels.push(165);
			createSelect(listChannels);
		}
	} else if (chBonding == 40 || chBonding == 80) {
		infoView.style.display = "block";
		listChnls.style.display = "none";
		allChnls.style.display = "none";

		if (extendedCh[0].checked) {
			listChnls.style.display = "block";
			allChnls.style.display = "none";
			infoView.style.display = "none";

			// listChannels + 68 72 76 80 84 88 92 96 elements
			listChannels.splice(8, 0, 68, 72, 76, 80, 84, 88, 92, 96);
			createSelect(listChannels);
		} 
		else if (extendedCh[1].checked) {
			listChnls.style.display = "block";
			allChnls.style.display = "none";
			infoView.style.display = "none";
			// listChannels elements
			createSelect(listChannels);
		}
	}
}

function createSelect(listChannels){
	let option;
	let select = document.getElementById("addChnlList");
	for (let i = 0; i < listChannels.length; i++) {
		option = document.createElement('option');
		option.setAttribute("value", listChannels[i]);
		option.innerHTML = listChannels[i];
		select.appendChild(option);
	}
}

function addAllChannels(){
	let inputChnls = document.getElementById("addChnl");
	let outputChnls = document.getElementById("addedChannels");
	outputChnls.textContent += inputChnls.value  + " ";
}

function addChannels(){
	let inputChnls = document.getElementById("addChnlList");
	let outputChnls = document.getElementById("addedChannels");
	let option = inputChnls.options;
	let str = "";

	for (let i = 0; i < option.length; i++) {
		if (option[i].selected) {
			str += option[i].text + " ";
		}
	}
	// cause we don't need in this backspace
	str = str.substring(0, str.length - 1);
	outputChnls.textContent += str  + " ";
}

function deleteChannel(){
	let chnls = document.getElementById("addedChannels");
	let arr = chnls.value.split(' ');
	// delete twice cause the last elem is backspace
	let variable = arr.pop();
	variable = arr.pop();
	let str = arr.join(' ');
	chnls.textContent = str + " ";
}

function validationSSID(){
	let ssid = document.getElementById("ssidWeb");
	let label = document.getElementById("inoSSID");

	if (ssid.value == ""){
		ssid.style.borderColor = "red";
		label.style.display = "block";
	} else {
		ssid.style.borderColor = "";
		label.style.display = "none";
	}
}

function validationWPAKey(){
	let wpaKey = document.getElementById("wpaKeyWeb");
	let label = document.getElementById("infoWPAKey");

	if (wpaKey.value.length < 8 || wpaKey.value.length > 63){
		wpaKey.style.borderColor = "red";
		label.style.display = "block";
	} else {
		wpaKey.style.borderColor = "";
		label.style.display = "none";
	}
}

function saveData(){

	let ssid = document.getElementById("ssidWeb");
	let wpaKey = document.getElementById("wpaKeyWeb");

	if(ssid.style.borderColor != "red" && wpaKey.style.borderColor != "red"){

		document.getElementById("ssidRaw").value = ssid.value;
		document.getElementById("chBondingRaw").value = document.getElementById("chBondingWeb").value;
		document.getElementById("wpaKeyRaw").value = wpaKey.value;

		let radioButton = document.getElementsByName("extendedChannel");
		if (radioButton[0].checked) {
			document.getElementById("extendedChRaw").value = "true";
		} 
		else if (radioButton[1].checked) {
			document.getElementById("extendedChRaw").value = "false";
		} else {
			document.getElementById("extendedChRaw").value = "";
		}

		radioButton = document.getElementsByName("useChannelLimit");
		if (radioButton[0].checked) {
			document.getElementById("useChLimRaw").value = "true";
			document.getElementById("chLimRaw").value = document.getElementById("addedChannels").value;
		} 
		else if (radioButton[1].checked) {
			document.getElementById("useChLimRaw").value = "false";
			document.getElementById("chLimRaw").value = "";
		}
		$('#tabs a[href="#raw"]').tab('show');
	}
}