$(document).ready(function() {
    let clothingCounter = 0;
    let clothingLinks = [];
    let keywordsArr = [];
    let keywordCounter = 0;
   

    $('#addClothingLink').on('click', (event) => {
        event.preventDefault();
        if($('#keywordsContainer').find('#warning')){
            $('#keywordsContainer').find('#warning').remove();
        }
        const link = $('#clothingLinks').val().trim();
        if($('#clothingLinksContainer').find('#cwarning1')){
            $('#clothingLinksContainer').find('#cwarning1').remove();
        }
        if($('#clothingLinksContainer').find('#cwarning2')){
            $('#clothingLinksContainer').find('#cwarning2').remove();
        }
        if(clothingCounter < 8 && typeof link == 'string' && link.match(/^https?:\/\/(?:www\.)?\w{0,64}\.(?:com|co\.\w{2})/) != null) {
            clothingLinks.push(link);
            $("#clothingLinksContainer").append(`
            <span class="bg-icon200 text-icon900 text-sm max-w-min font-semibold mr-2 px-2.5 py-0.5 rounded flex space-x-2">
                <p>${link}<p>
                <button type="button" class="removeClothingLink">x</button>
            </span>`);
            $('#clothingLinks').val('');
            clothingCounter++;
        }

        if(typeof link != 'string' || link.match(/^https?:\/\/(?:www\.)?\w{0,64}\.(?:com|co\.\w{2})/) == null){
            $("#clothingLinksContainer").append(`
                <p class="text-center" id="cwarning1">Invalid link</p>
            `);
            $('#clothingLinks').val('');
        }
        if(clothingCounter == 8){
            $("#clothingLinksContainer").append(`
                <p class="text-center" id="cwarning2">Clothing links limit reached</p>
            `);
            $('#clothingLinks').val('');
        }
    });

    $('#clothingLinksContainer').on('click', '.removeClothingLink', (event) => {
        event.preventDefault();
        let parent = event.target.parentElement;
        clothingLinks.splice(clothingLinks.indexOf(parent.firstChild.innerText), 1);
        clothingCounter--;
        if(clothingCounter<8){
            $('#clothingLinksContainer').find('#cwarning1').remove();
            $('#clothingLinksContainer').find('#cwarning2').remove();
        }
        parent.parentElement.remove();
    });

    $('#addKeyword').on('click', (event)=>{
        event.preventDefault();
        const key = $('#keywordsInput').val().trim();
        if($('#keywordsContainer').find('#warning')){
            $('#keywordsContainer').find('#warning').remove();
        }
        if($('#keywordsContainer').find('#kwarning1')){
            $('#keywordsContainer').find('#kwarning1').remove();
        }
        if($('#keywordsContainer').find('#kwarning2')){
            $('#keywordsContainer').find('#kwarning2').remove();
        }
        if(typeof key != 'string' || key.length < 3 || key.length > 16 || keywordsArr.includes(key) || key ==""){
            $('#keywordsContainer').append(`
                <p class="text-center" id="kwarning1">Invalid keyword</p>
            `);
            $('#keywordsInput').val('');
        }
        if(keywordCounter <=5 && typeof key == 'string' && key.length >= 3 && key.length <= 16 && !keywordsArr.includes(key)){
            keywordsArr.push(key);
            console.log(keywordsArr);
            $('#keywordsContainer').append(`
                <span class="bg-icon200 text-icon900 text-sm max-w-min font-semibold mr-2 px-2.5 py-0.5 rounded flex space-x-2">
                    <p>${key}<p>
                    <button type="button" class="removeKeyword">x</button>
                </span>`);
            $('#keywordsInput').val('');
            keywordCounter++;
        }
        if(keywordCounter == 5){
            $("#keywordsContainer").append(`
                <p class="text-center" id="kwarning2">Keywords limit reached</p>
            `);
            $('#keywordsInput').val('');
        }
    });

    $('#keywordsContainer').on('click', '.removeKeyword', (event) => {
        event.preventDefault();
        let parent = event.target.parentElement;
        keywordsArr.splice(keywordsArr.indexOf(parent.firstChild.innerText), 1);
        keywordCounter--;
        if(keywordCounter<5){
            $('#keywordsContainer').find('#kwarning1').remove();
            $('#keywordsContainer').find('#kwarning2').remove();
        }
        parent.parentElement.remove();
    });
    
    $('#createPost').on('click', (event) => {
        event.preventDefault();
        if($('#keywordsContainer').find('#warning')){
            $('#keywordsContainer').find('#warning').remove();
        }
        if(clothingLinks.length == 0 || keywordsArr.length == 0){
            $('#keywordsContainer').append(`
                <p class="text-center" id="warning">Clothing links and keywords require input</p>
            `);
        }
    });
});