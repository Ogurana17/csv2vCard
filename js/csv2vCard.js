// 1: ボタンを取得してchangeイベントの設定
var loadBtn = document.querySelector("#loadBtn");
loadBtn.addEventListener("change", upload, false);

function upload(event) {
    // 2：chekFileReader関数でFileAPIにブラウザが対応してるかチェック
    if (!checkFileReader()) {
        alert("エラー：FileAPI非対応のブラウザです。");
    } else {
        // 3: 選択されたファイル情報を取得
        var file = event.target.files[0];
        var type = file.type; // MIMEタイプ
        var size = file.size; // ファイル容量（byte）
        var limit = 100000; // byte, 100KB

        // MIMEタイプの判定
        if (type == "image/jpeg") {
            alert("画像はアップロードできません");
            loadBtn.value = "";
            return;
        }

        //readerオブジェクトを作成
        var reader = new FileReader();
        // ファイル読み取りを実行
        reader.readAsText(file);

        // 4：CSVファイルを読み込む処理とエラー処理をする
        reader.onload = function (event) {
            var result = event.target.result;
            makeCSV(result);
        };

        //読み込めなかった場合のエラー処理
        reader.onerror = function () {
            alert("エラー：ファイルをロードできません。");
        };
    }
}

//csvをうまく出力する
function makeCSV(csvdata) {
    //csvデータを1行ごとに配列にする
    var tmp = csvdata.split("\n");

    //csvデータを出力する
    var tabledata = $("#resulttable");
    var vCardStr = "";

    //６：1行のデータから各項目（各列）のデータを取りだして、2次元配列にする
    var data = [];
    for (var i = 1; i < tmp.length; i++) {
        //csvの1行のデータを取り出す
        var row_data = tmp[i];
        data[i] = row_data.split(",");
        //7：dataに入ってる各列のデータを出力する為のデータを作る
        vCardStr += "BEGIN:VCARD\n"
        vCardStr += "VERSION:3.0\n"
        for (var j = 0; j < data[i].length; j++) {
            //各行の列のデータを個別に出力する
            switch (j) {
                case 0:
                    vCardStr += "N:" + data[i][j] + ";;;\n";
                    break;
                case 1:
                    vCardStr += "FN:" + data[i][j] + "\n";
                    break;
                case 2:
                    vCardStr += "X-PHONETIC-FIRST-NAME:" + data[i][j] + "\n";
                    break;
                case 3:
                    vCardStr += "X-PHONETIC-LAST-NAME:" + data[i][j] + "\n";
                    break;
                case 4:
                    vCardStr += "ORG:" + data[i][j] + "\n";
                    break;
                case 5:
                    vCardStr += "X-PHONETIC-ORG:" + data[i][j] + "\n";
                    break;
                case 6:
                    vCardStr += "EMAIL;type=INTERNET;type=pref:" + data[i][j] + "\n";
                    break;
                case 7:
                    vCardStr += "ADR;type=WORK;type=pref:" + data[i][j] + "\n";
                    break;
                case 8:
                    vCardStr += "item1.URL; type = pref:" + data[i][j] + "\n";
                    break;
                case 9:
                    vCardStr += "TEL;type=CELL;type=VOICE;type=pref:" + data[i][j] + "\n";
                    break;
            }
        }
        vCardStr += "item1.X-ABLabel:homePage\n";
        vCardStr += "END:VCARD\n"
    }

    var output = document.getElementById('outputText');
    output.value = vCardStr;

    const btn = document.getElementById('btn');
    const blob = new Blob([vCardStr], {
        "type": "text/plain"
    });
    btn.href = window.URL.createObjectURL(blob);
}
// ファイルアップロード判定
function checkFileReader() {
    var isUse = false;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        isUse = true;
    }
    return isUse;
}