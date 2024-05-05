let counter = 0;

$("#addClothingLink").on("click", function(event) {
    event.preventDefault();
    $("#clothingLinksContainer").append(`
        <span class="flex w-full relative">
            <input class="w-full" type='text' name='clothingLinks[]' placeholder='Clothing Link'>
            <button type='button' class='bg-red-400 px-2 rounded-lg absolute right-0 removeClothingLink'>-</button>
        </span>
    `);
    counter++;
});
$("#clothingLinksContainer").on("click", ".removeClothingLink", function(event) {
    event.preventDefault();
    $(this).parent().remove();
    counter--;
});