const saveButton = document.getElementById("save");
const importButton = document.getElementById("import");
const list = document.getElementById("list");

//사이트를 json 파일로 저장
saveButton.onclick = function save(){
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {

    let currentUrl = tabs[0].url;
    let data = { website : currentUrl };
    let jsonStr = JSON.stringify(data,2);
    let blob = new Blob([jsonStr], {type: "application/json"});
    let downloadUrl = URL.createObjectURL(blob);

    let fileName = prompt("저장될 파일명을 입력해주세요");

    if(fileName === null){
      return;
    }

    //가상의 <a> 생성 후 자동 다운로드
    let temporary = document.createElement("a");
    temporary.href = downloadUrl;
    temporary.download = fileName + ".json";

    document.body.appendChild(temporary);
    temporary.click();

    document.body.removeChild(temporary);

    window.URL.revokeObjectURL(downloadUrl);

    // 리스트에 탭 추가
  });
};

//업로드 된 JSON 파일에서 URL을 가져와 열기
importButton.addEventListener('change',(event) => {
  const file = event.target.files[0];

  if(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
      const contents = e.target.result;

      try {
        const jsonFile = JSON.parse(contents);

        let openUrl = jsonFile.website;

        chrome.tabs.create({ url : openUrl});

      } catch(e) {
        alert("오류가 발생했습니다! 다시 시도해주세요.");
      }
    };

    reader.readAsText(file);
  }
});