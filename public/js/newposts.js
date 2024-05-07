$(document).ready(function() {

    console.log("FOrm")
    let clothingCounter = 0;
    let clothingLinks = [];
    let keywordsArr = [];
    let keywordCounter = 0;
   
    $('#addClothingLink').on('click', (event) => {
        event.preventDefault();
        const link = $('#clothingLinks').val().trim();
        $('#keywordsContainer').find('#warning').remove();
        $('#clothingLinksContainer').find('#cwarning1').remove();
        $('#clothingLinksContainer').find('#cwarning2').remove();
        if (
          clothingLinks.length < 8 &&
          typeof link == "string" &&
          link.match(/^https?:\/\/(?:www\.)?\w{0,64}\.(?:com|co\.\w{2})/) != null &&
          !clothingLinks.includes(link)
        ) {
          clothingLinks.push(link);
          console.log(link);
          $("#clothingLinksContainer").append(`
            <span class="bg-icon200 text-icon900 text-sm max-w-min font-semibold mr-2 px-2.5 py-0.5 rounded flex space-x-2">
                <p>${link}<p>
                <button type="button" class="removeClothingLink">x</button>
            </span>`);
          $("#clothingLinks").val("");
          clothingCounter++;
        }
        else{
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
        $('#keywordsContainer').find('#warning').remove();
        $('#keywordsContainer').find('#kwarning1').remove();
        $('#keywordsContainer').find('#kwarning2').remove();
        
        if(typeof key != 'string' || key.length < 3 || key.length > 16 || keywordsArr.includes(key) || key ==""){
            $('#keywordsContainer').append(`
                <p class="text-center" id="kwarning1">Invalid keyword</p>
            `);
            $('#keywordsInput').val('');
        }
        if(keywordCounter <=5 && typeof key == 'string' && key.length >= 3 && key.length <= 16 && !keywordsArr.includes(key)){
            keywordsArr.push(key);
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

    // $('#createPost').on('click', (event) => {
    //    // event.preventDefault();
    //     $('#keywordsContainer').find('#warning').remove();
    //     $('#clothingLinksContainer').find('#cwarning1').remove();
    //     $('#clothingLinksContainer').find('#cwarning2').remove();
    //     $('#keywordsContainer').find('#kwarning1').remove();
    //     $('#keywordsContainer').find('#kwarning2').remove();
    //     const desc = $('#description').val().trim();
    //     if(clothingLinks.length == 0 || keywordsArr.length == 0 || desc == "" || !desc){
    //         $('#keywordsContainer').append(`
    //             <p class="text-center" id="warning">All fields require input</p>
    //         `);
    //     }
    // });
    
    $('#createPostForm').on("submit", (event) => {
        event.preventDefault();

        $('#keywordsContainer').find('#warning').remove();
        $('#clothingLinksContainer').find('#cwarning1').remove();
        $('#clothingLinksContainer').find('#cwarning2').remove();
        $('#keywordsContainer').find('#kwarning1').remove();
        $('#keywordsContainer').find('#kwarning2').remove();

        let post_image =  $('#post-image')[0].files[0];
        let description = $('#description');

        let formData = new FormData();

        formData.append("description", description.val());
        formData.append('post-image', post_image);        

        clothingLinks.forEach((link) => { 
            console.log(link);
            formData.append("clothingLinks[]", link);
            
        });
       
        
        keywordsArr.forEach((keyword) => { 
            formData.append("keywords[]", keyword); });

        //console.log(formData);

        $.ajax({
            type: "POST",
            url: "/posts", 
            data: formData,
            success: function(response) {
                console.log("SUCCESS:" +response);
                
            },
            error: function(xhr, status, error) {
                console.log("ERROR:" +error);
                $('#keywordsContainer').append(`
                    <p class="text-center" id="warning">All fields require input</p>
                `);
            }
        });
    });


});
