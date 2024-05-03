/*
Populate data and test
*/

import { dbConnection, closeConnection } from ".././config/mongoConnections.js";
import { userData, postData, commentData, keywordData } from "../data/index.js";
import { getRecommendedPosts } from "../data/algo.js";

function generatePassword() {
    const length = Math.floor(Math.random() * (20 - 8 + 1)) + 8;
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const specialChars = '!@#$%^&*()-_=+';
    const numbers = '0123456789';

    let password = '';
    let hasUppercase = false;
    let hasLowercase = false;
    let hasSpecialChar = false;
    let hasNumber = false;

    while (password.length < length) {
        const charType = Math.floor(Math.random() * 4);

        switch (charType) {
            case 0:
                password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
                hasUppercase = true;
                break;
            case 1:
                password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
                hasLowercase = true;
                break;
            case 2:
                password += specialChars[Math.floor(Math.random() * specialChars.length)];
                hasSpecialChar = true;
                break;
            case 3:
                password += numbers[Math.floor(Math.random() * numbers.length)];
                hasNumber = true;
                break;
        }
    }

    if (!hasUppercase || !hasLowercase || !hasSpecialChar || !hasNumber) {
        return generatePassword();
    }

    return password;
}

async function main() {
	const db = await dbConnection();
	await db.dropDatabase();
	// Create users
    const user1 = await userData.createUser(
        "EthanSilv",
        "Password1!",
        "fillerimage.url",
        Math.floor(Math.random() * (75 - 13 + 1)) + 13,
        "Hi, I love fashion and posting my outfits!"
    );
    const user2 = await userData.createUser(
		"Fashionista123",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Fashion enthusiast with a passion for style and trends!"
	);
	const user3 = await userData.createUser(
		"StyleGuru24",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Sharing my love for fashion and inspiring others to find their own unique style."
	);
	const user4 = await userData.createUser(
		"VintageVibes77",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Obsessed with all things vintage and retro!"
	);
	const user5 = await userData.createUser(
		"StreetwearStar",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Bringing streetwear to the forefront of fashion."
	);
	const user6 = await userData.createUser(
		"MinimalistMaven",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Less is more. Embracing the beauty of minimalism in fashion and life."
	);
	const user7 = await userData.createUser(
		"BohemianBeauty",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Free-spirited and eclectic, with a love for bohemian fashion."
	);
	const user8 = await userData.createUser(
		"ClassicChic",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Timeless elegance and sophistication are my style staples."
	);
	const user9 = await userData.createUser(
		"AthleisureAddict",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Living in athleisure and loving it! Comfort and style combined."
	);
	const user10 = await userData.createUser(
		"SustainableStyle",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Promoting sustainable and ethical fashion choices."
	);
    const user11 = await userData.createUser(
		"GlamourGirl",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Adding a touch of glamour to every outfit."
	);
    const user12 = await userData.createUser(
		"PreppyPrincess",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Embracing the preppy aesthetic with classic and polished looks."
	);
    const user13 = await userData.createUser(
		"RockerEdge",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Adding a rocker edge to my wardrobe with leather jackets and band tees."
	);
    const user14 = await userData.createUser(
		"GirlyGlam",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"All about girly and glamorous fashion choices."
	);
    const user15 = await userData.createUser(
		"TomboyTrend",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Mixing tomboy style with trendy pieces for a unique look."
	);
    const user16 = await userData.createUser(
		"ArtsyAttire",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Expressing myself through my artsy and creative fashion choices."
	);
    const user17 = await userData.createUser(
		"EdgyEnsembles",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Pushing the boundaries with edgy and daring ensembles."
	);
    const user18 = await userData.createUser(
		"ComfyCasual",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Keeping it comfy and casual with my everyday outfits."
	);
    const user19 = await userData.createUser(
		"ChicAndSophistic",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Aiming for chic and sophisticated style in all my looks."
	);
    const user20 = await userData.createUser(
		"TrendsetExtr0",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Setting trends and inspiring others with my bold fashion choices."
	);
    const user21 = await userData.createUser(
		"VintageVogue",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Mixing vintage finds with modern pieces for a unique and stylish look."
	);
    const user22 = await userData.createUser(
		"StreetStylSav",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Mastering the art of street style with effortless cool."
	);
    const user23 = await userData.createUser(
		"MinimalistM8",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Keeping it simple and stylish with a minimalist approach to fashion."
	);
    const user24 = await userData.createUser(
		"BohoBabe",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Embracing the boho lifestyle with flowy fabrics and earthy tones."
	);
    const user25 = await userData.createUser(
		"ClassicCouture",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Investing in classic pieces that never go out of style."
	);
    const user26 = await userData.createUser(
		"SportySpice",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Mixing sporty and stylish pieces for a comfortable and chic look."
	);
    const user27 = await userData.createUser(
		"EcoFashionista",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Making sustainable fashion choices that are good for the planet and my wardrobe."
	);
    const user28 = await userData.createUser(
		"HollywoodGlam",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Channeling old Hollywood glamour with elegant and sophisticated looks."
	);
    const user29 = await userData.createUser(
		"PreppyPerfect",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Perfecting the preppy look with classic pieces and bold colors."
	);
    const user30 = await userData.createUser(
		"RockstarStyle",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Rocking out in style with edgy and rebellious fashion choices."
	);
    const user31 = await userData.createUser(
		"GirlyGirl",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Embracing my feminine side with girly and glamorous outfits."
	);
    const user32 = await userData.createUser(
		"TomboyChic",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Mixing tomboy style with chic pieces for a cool and effortless look."
	);
    const user33 = await userData.createUser(
		"CreativeCouture",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Expressing my creativity through my unique and artistic fashion choices."
	);
    const user34 = await userData.createUser(
		"DaringDresser",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Taking fashion risks and experimenting with bold and daring looks."
	);
    const user35 = await userData.createUser(
		"CasualCool",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Keeping it casual and cool with my everyday style."
	);
    const user36 = await userData.createUser(
		"SophistStyl",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Elevating my wardrobe with sophisticated and timeless pieces."
	);
    const user37 = await userData.createUser(
		"FashionForward",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Staying ahead of the trends and embracing fashion-forward looks."
	);
    const user38 = await userData.createUser(
		"RetroRevival",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Bringing back retro styles with a modern twist."
	);
    const user39 = await userData.createUser(
		"UrbanEdge",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Adding an urban edge to my outfits with streetwear-inspired pieces."
	);
    const user40 = await userData.createUser(
		"SimpleAndChic",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Keeping it simple and chic with my minimalist wardrobe."
	);
    const user41 = await userData.createUser(
		"BohemianSpirit",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Expressing my bohemian spirit through my free-flowing and eclectic style."
	);
    const user42 = await userData.createUser(
		"TimelessTaste",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Investing in timeless pieces that will last for years to come."
	);
    const user43 = await userData.createUser(
		"ActivaterBobby",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Staying active and stylish with my athleisure-inspired looks."
	);
    const user44 = await userData.createUser(
		"Lilyann",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Making conscious fashion choices that are good for the environment and the people who make my clothes."
	);
    const user45 = await userData.createUser(
		"GlamGoddess",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Adding a touch of glam to my everyday outfits."
	);
    const user46 = await userData.createUser(
		"GeorgeHarr",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Keeping it polished and preppy with my classic and timeless style."
	);
    const user47 = await userData.createUser(
		"RebelWithStyle",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Adding a rebellious edge to my outfits with rocker-inspired pieces."
	);
    const user48 = await userData.createUser(
		"FeminineFashion",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Embracing my femininity with girly and glamorous fashion choices."
	);
    const user49 = await userData.createUser(
		"CoolAndCasual",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Keeping it cool and casual with my effortless style."
	);
    const user50 = await userData.createUser(
		"ArtsyAndUnique",
		generatePassword(),
		"fillerimage.url",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Expressing my artistic side through my unique and creative fashion choices."
	);

	// Create posts
	const post1 = await postData.create(
		user1._id,
		"image.png",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["classic", "minimalist"],
		"A classic style with great minimalist qualities"
	);
	const post2 = await postData.create(
		user1._id,
		"image.png",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Trendy", "Urban", "Chic"],
		"Rocking the latest trends on the city streets"
	);
	const post3 = await postData.create(
		user1._id,
		"image.png",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Classic", "Elegant", "Timeless"],
		"Classic elegance never goes out of style"
	);
	const post4 = await postData.create(
		user2._id,
		"image.png",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Sporty", "Athleisure", "Comfortable"],
		"Staying comfy and stylish in my athleisure wear Yasss"
	);
	const post5 = await postData.create(
		user2._id,
		"image.png",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Vintage", "Retro", "Unique"],
		"Found the perfect vintage piece to add to my collection"
	);
	const post6 = await postData.create(
		user2._id,
		"image.png",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Minimalist", "Simple", "Chic"],
		"Less is more Embracing the beauty of minimalism in fashion"
	);
	const post7 = await postData.create(
		user3._id,
		"image.png",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html",],
		["Bohemian", "Vintage", "Earthy"],
		"Flowy fabrics and earthy tones for the bohemian soul"
	);
	const post8 = await postData.create(
		user3._id,
		"image.png",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Classic", "Elegant", "Timeless"],
		"Timeless elegance and sophistication are my style staples"
	);
	const post9 = await postData.create(
		user4._id,
		"image.png",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Athleisure", "Sporty", "Comfortable"],
		"Living in athleisure and loving it Comfort and style combined"
	);
	const post10 = await postData.create(
		user4._id,
		"image.png",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Sustainable", "Ethical", "Casual"],
		"Promoting sustainable and ethical fashion choices. #sustainablefashion"
	);
	const post11 = await postData.create(
		user5._id,
		"image.png",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Glamorous", "Chic", "Sparkly"],
		"Adding a touch of glamour to every outfit. #glamstyle"
	);
	const post12 = await postData.create(
		user6._id,
		"image.png",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Preppy", "Classic", "Polished"],
		"Embracing the preppy aesthetic with classic and polished looks. #preppystyle"
	);
	const post13 = await postData.create(
		user6._id,
		"image.png",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Rocker", "Edgy", "Rebellious"],
		"Adding a rocker edge to my wardrobe with leather jackets and band tees. #rockerstyle"
	);
	const post14 = await postData.create(
		user7._id,
		"image.png",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Girly", "Glamorous", "Feminine"],
		"All about girly and glamorous fashion choices. #girlyglam"
	);
	const post15 = await postData.create(
		user7._id,
		"image.png",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Tomboy", "Trendy", "Casual"],
		"Mixing tomboy style with trendy pieces for a unique look. #tomboychic"
	);
	const post16 = await postData.create(
		user7._id,
		"image.png",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Artsy", "Creative", "Unique"],
		"Expressing myself through my artsy and creative fashion choices. #artsyfashion"
	);
	const post17 = await postData.create(
		user8._id,
		"image.png",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Edgy", "Daring", "Bold"],
		"Pushing the boundaries with edgy and daring ensembles. #edgystyle"
	);
	const post18 = await postData.create(
		user9._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Casual", "Comfortable", "Relaxed"],
		"Keeping it comfy and casual with my everyday outfits. #casualstyle"
	);
	const post19 = await postData.create(
		user9._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Chic", "Sophisticated", "Elegant"],
		"Aiming for chic and sophisticated style in all my looks. #chicstyle"
	);
	const post20 = await postData.create(
		user10._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Trendy", "Bold", "Vintage"],
		"Setting trends and inspiring others with my bold fashion choices. #trendsetter"
	);
	const post21 = await postData.create(
		user10._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Vintage", "Modern", "Unique"],
		"Mixing vintage finds with modern pieces for a unique and stylish look. #vintagefashion"
	);
	const post22 = await postData.create(
		user10._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Streetstyle", "Urban", "Cool"],
		"Mastering the art of street style with effortless cool. #streetstylesavvy"
	);
	const post23 = await postData.create(
		user11._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Minimalist", "Simple", "Understated"],
		"Keeping it simple and stylish with a minimalist approach to fashion. #minimalistmaster"
	);
	const post24 = await postData.create(
		user12._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Bohemian", "Flowy", "Earthy"],
		"Embracing the boho lifestyle with flowy fabrics and earthy tones. #bohobabe"
	);
	const post25 = await postData.create(
		user12._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Classic", "Timeless", "Sophisticated"],
		"Investing in classic pieces that never go out of style. #classiccouture"
	);
	const post26 = await postData.create(
		user13._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Rocker", "Edgy", "Rebellious"],
		"Adding a rocker edge to my wardrobe with leather jackets and band tees. #rockerstyle"
	);
	const post27 = await postData.create(
		user13._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Grunge", "Dark", "Alternative"], 
		"Embracing my inner grunge with dark and edgy pieces. #grungestyle"
	);
	const post28 = await postData.create(
		user14._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Girly", "Glamorous", "Feminine"],
		"All about girly and glamorous fashion choices. #girlyglam"
	);
	const post29 = await postData.create(
		user14._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Trendy", "Chic", "Colorful"],
		"Loving these bright and trendy pieces! #fashionlover"
	);
	const post30 = await postData.create(
		user15._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Tomboy", "Trendy", "Casual"],
		"Mixing tomboy style with trendy pieces for a unique look. #tomboychic" 
	);
	const post31 = await postData.create(
		user16._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Artsy", "Creative", "Unique"],
		"Expressing myself through my artsy and creative fashion choices. #artsyfashion"
	);
	const post32 = await postData.create( 
		user16._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Bohemian", "Flowy", "Colorful"], 
		"Adding a touch of bohemian flair to my wardrobe. #bohovibes" 
	);
	const post33 = await postData.create(
		user17._id,
		"image.png", 
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Edgy", "Daring", "Bold"],
		"Pushing the boundaries with edgy and daring ensembles. #edgystyle" 
	);
	const post34 = await postData.create( 
		user18._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Casual", "Comfortable", "Relaxed"],
		"Keeping it comfy and casual with my everyday outfits. #casualstyle"
	); 
	const post35 = await postData.create(
		user18._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Sporty", "Athleisure", "Active"],
		"Staying active and stylish in my athleisure wear. #sportystyle" 
	); 
	const post36 = await postData.create(
		user19._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Chic", "Sophisticated", "Elegant"], 
		"Aiming for chic and sophisticated style in all my looks. #chicstyle"
	);
	const post37 = await postData.create(
		user20._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Trendy", "Bold", "Vintage"],
		"Setting trends and inspiring others with my bold fashion choices. #trendsetter"
	);
	const post38 = await postData.create(
		user21._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Vintage", "Modern", "Unique"], 
		"Mixing vintage finds with modern pieces for a unique and stylish look. #vintagefashion"
	);
	const post39 = await postData.create(
		user22._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Streetstyle", "Urban", "Cool"], 
		"Mastering the art of street style with effortless cool. #streetstylesavvy" 
	);
	const post40 = await postData.create(
		user23._id, 
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Minimalist", "Simple", "Understated"],
		"Keeping it simple and stylish with a minimalist approach to fashion. #minimalistmaster"
	);
	const post41 = await postData.create(
		user24._id, 
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Bohemian", "Flowy", "Earthy"],
		"Embracing the boho lifestyle with flowy fabrics and earthy tones. #bohobabe" 
	);
	const post42 = await postData.create( 
		user25._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Classic", "Timeless", "Sophisticated"],
		"Investing in classic pieces that never go out of style. #classiccouture" 
	);
	const post43 = await postData.create(
		user26._id, 
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Sporty", "Stylish", "Comfortable"], 
		"Mixing sporty and stylish pieces for a comfortable and chic look. #sportyspice" 
	);
	const post44 = await postData.create( 
		user26._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Athleisure", "Trendy", "Functional"], 
		"Loving the athleisure trend for its comfort and style. #athleisurelover" 
	); 
	const post45 = await postData.create(
		user27._id,
		"image.png", 
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Sustainable", "Ethical", "Vintage"], 
		"Making sustainable fashion choices that are good for the planet and my wardrobe. #sustainablefashionista"
	);
	const post46 = await postData.create( 
		user28._id,
		"image.png", 
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Glamorous", "Hollywood", "Elegant"], 
		"Channeling old Hollywood glamour with elegant and sophisticated looks. #hollywoodglam"
	);
	const post47 = await postData.create( 
		user29._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Preppy", "Classic", "Polished"],
		"Perfecting the preppy look with classic pieces and bold colors. #preppyperfection"
	); 
	const post48 = await postData.create(
		user29._id, 
		"image.png", 
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Nautical", "Stripes", "Summery"], 
		"Loving the nautical vibes for summer! #nauticalstyle"
	);
	const post49 = await postData.create(
		user30._id, 
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Rockstar", "Edgy", "Rebellious"], 
		"Rocking out in style with edgy and rebellious fashion choices. #rockstarstyle" 
	);
	const post50 = await postData.create( 
		user30._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Leather", "Black", "Bold"], 
		"Adding a touch of leather to my look for an edgy vibe. #leatherlover"
	);
	const post51 = await postData.create(
		user30._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Vintage", "Music", "Casual"], 
		"Expressing my love for music through band tees and casual style. #bandteestyle" 
	);
	const post52 = await postData.create( 
		user31._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Girly", "Pink", "Feminine"], 
		"Embracing my feminine side with girly and pink outfits. #girlygirl"
	);
	const post53 = await postData.create( 
		user32._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Tomboy", "Chic", "Effortless"],
		"Mixing tomboy style with chic pieces for a cool and effortless look. #tomboychic" 
	); 
	const post54 = await postData.create(
		user33._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Creative", "Unique", "Colorful"],
		"Expressing my creativity through my unique and artistic fashion choices. #creativecouture"
	); 
	const post55 = await postData.create(
		user34._id, 
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Daring", "Bold", "Experimental"],
		"Taking fashion risks and experimenting with bold and daring looks. #daringdresser" 
	); 
	const post56 = await postData.create(
		user34._id, 
		"image.png", 
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Vintage", "Unique", "Retro"], 
		"Pushing the boundaries of fashion with avant-garde and unique pieces. #avantgardestyle"
	);
	const post57 = await postData.create( 
		user35._id, 
		"image.png", 
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Casual", "Denim", "Comfortable"], 
		"Keeping it casual and cool with my favorite denim pieces. #casualcool"
	); 
	const post58 = await postData.create(
		user36._id,
		"image.png",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Sophisticated", "Timeless", "Elegant"],
		"Elevating my wardrobe with sophisticated and timeless pieces. #sophisticatedstyle" 
	);
	const post59 = await postData.create(
		user36._id,
		"image.png",
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Tailored", "Chic", "Polished"], 
		"Loving the look of tailored pieces for a chic and polished style. #tailoredstyle"
	);
	const post60 = await postData.create(
		user37._id, 
		"image.png",
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Retro", "Trendy", "Unique"],
		"Staying ahead of the trends and embracing fashion-forward looks. #fashionforward"
	);
	const post61 = await postData.create( 
		user37._id, 
		"image.png",
		["https://www.fairharborclothing.com/collections/mens-swim-1"], 
		["Streetwear", "Urban", "Sporty"],
		"Mixing streetwear and sporty pieces for a cool and urban look. #urbanstyle"
	); 
	const post62 = await postData.create( 
		user37._id,
		"image.png", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Minimalist", "Monochrome", "Chic"], 
		"Keeping it simple and chic with a minimalist and monochrome palette. #minimalistchic" 
	);
	const post63 = await postData.create( 
		user38._id,
		"image.png", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Retro", "Vintage", "Colorful"],
		"Bringing back retro styles with a modern twist. #retrorevival"
	); 
	const post64 = await postData.create( 
		user38._id, 
		"image.png",
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Denim", "Casual", "Classic"],
		"Denim is always a classic choice for a casual and cool look. #denimlover"
	);
	const post65 = await postData.create(
		user39._id, 
		"image.png", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Urban", "Streetwear", "Edgy"], 
		"Adding an urban edge to my outfits with streetwear-inspired pieces. #urbanedge"
	);
	const post66 = await postData.create( 
		user39._id, 
		"image.png",
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Urban", "Statement", "Casual"],
		"Making a statement with graphic tees and casual style. #graphicteestyle"
	); 
	const post67 = await postData.create(
		user40._id, 
		"image.png", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Minimalist", "Neutral", "Timeless"],
		"Keeping it simple and chic with a minimalist wardrobe in neutral tones. #simpleandchic"
	); 
	const post68 = await postData.create(
		user41._id,
		"image.png", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"], 
		["Bohemian", "Flowy", "Eclectic"], 
		"Expressing my bohemian spirit through my free-flowing and eclectic style. #bohemianspirit"
	);
	const post69 = await postData.create(
		user41._id, 
		"image.png",
		["https://www.fairharborclothing.com/collections/mens-swim-1"], 
		["Athletic", "Summery", "Comfortable"],
		"Loving the comfort and style of maxi dresses for summer. #maxidresslover" 
	);
	const post70 = await postData.create(
		user42._id,
		"image.png",
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Classic", "Timeless", "Investment"], 
		"Investing in timeless pieces that will last for years to come. #timelesstaste" 
	);
	const post71 = await postData.create(
		user43._id,
		"image.png", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Active", "Sporty", "Athleisure"],
		"Staying active and stylish with my athleisure-inspired looks. #activeandstylish" 
	);
	const post72 = await postData.create(
		user43._id, 
		"image.png", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Sneakers", "Comfortable", "Casual"],
		"Sneakers are my go-to for comfort and casual style. #sneakerhead" 
	); 
	const post73 = await postData.create( 
		user44._id, 
		"image.png",
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Sustainable", "Ethical", "Conscious"], 
		"Making conscious fashion choices that are good for the environment and the people who make my clothes. #consciousconsumer"
	);
	const post74 = await postData.create( 
		user44._id,
		"image.png",
		["https://www.fairharborclothing.com/collections/mens-swim-1"], 
		["Vintage", "Retro", "Comfortable"], 
		"Choosing eco-friendly clothing made from natural fabrics for comfort and sustainability. #ecofashion"
	); 
	const post75 = await postData.create(
		user45._id,
		"image.png", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Glamorous", "Sparkly", "Chic"], 
		"Adding a touch of glam to my everyday outfits. #glamgoddess"
	); 
	const post76 = await postData.create(
		user45._id,
		"image.png", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Sequins", "Party", "Festive"],
		"Bringing on the sparkle with sequins for a party-ready look. #sequinslover" 
	);
	const post77 = await postData.create( 
		user46._id, 
		"image.png",
		["https://www.fairharborclothing.com/collections/mens-swim-1"], 
		["Preppy", "Classic", "Timeless"], 
		"Keeping it polished and preppy with my classic and timeless style. #polishedandpreppy"
	);
	const post78 = await postData.create(
		user47._id,
		"image.png", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"], 
		["Rebellious", "Edgy", "Leather"],
		"Adding a rebellious edge to my outfits with rocker-inspired pieces. #rebelwithstyle"
	); 
	const post79 = await postData.create(
		user48._id,
		"image.png",
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Feminine", "Floral", "Romantic"], 
		"Embracing my femininity with floral and romantic pieces. #femininefashion"
	);
	const post80 = await postData.create( 
		user49._id,
		"image.png",
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Casual", "Effortless", "Cool"],
		"Keeping it cool and casual with my effortless style. #casualcool" 
	);
	const post81 = await postData.create( 
		user50._id,
		"image.png", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Artistic", "Unique", "Creative"], 
		"Expressing my artistic side through my unique and creative fashion choices. #artsyandunique" 
	);
	// Create comments


	// const comment1 = await commentData.create(post1._id, user1._id, "comment1");
	// const comment2 = await commentData.create(post2._id, user2._id, "comment2");
	// const comment3 = await commentData.create(post3._id, user3._id, "comment3");;

	//create likes
	// await postData.addLike(user1._id.toString(), post2._id.toString());
	// await postData.addLike(user2._id.toString(), post2._id.toString());

	// await postData.addLike(user1._id.toString(), post3._id.toString());
	// await postData.addLike(user2._id.toString(), post3._id.toString());

	// await postData.addInteraction(post1._id.toString(), user1._id.toString(), 10);
	// await postData.addInteraction(post2._id.toString(), user1._id.toString(), 10);
	// await postData.addInteraction(post3._id.toString(), user1._id.toString(), 10);

	// await postData.addInteraction(post2._id.toString(), user2._id.toString(), 7);
	// await postData.addInteraction(post3._id.toString(), user2._id.toString(), 7);

	// await postData.addInteraction(post3._id.toString(), user3._id.toString(), 10);

	// await postData.addInteraction(post4._id.toString(), user4._id.toString(), 8);

	// await postData.addInteraction(post5._id.toString(), user5._id.toString(), 9);

	// await postData.addInteraction(post6._id.toString(), user6._id.toString(), 7);

	// await postData.addInteraction(post7._id.toString(), user7._id.toString(), 7);

	// await postData.addInteraction(post8._id.toString(), user8._id.toString(), 6);

	// await postData.addInteraction(post9._id.toString(), user9._id.toString(), 5);

	// await postData.addInteraction(post10._id.toString(), user10._id.toString(), 5);

	// await postData.addInteraction(post11._id.toString(), user11._id.toString(), 5);

	// await postData.addInteraction(post12._id.toString(), user12._id.toString(), 6);

	// await postData.addInteraction(post13._id.toString(), user13._id.toString(), 7);

	// await postData.addInteraction(post14._id.toString(), user14._id.toString(), 6);

	// await postData.addInteraction(post15._id.toString(), user15._id.toString(), 7);

	// const recommendedPosts = await getRecommendedPosts(user1._id.toString());
	// console.log("rec posts", recommendedPosts);

	// const removingLike = await posts.removeLike(user1._id.toString(),post2._id.toString());
	// console.log('likes', removingLike.likes);

	// const addingKeyword = await posts.addKeyword(post2._id.toString(), keyword1._id.toString());
	// console.log('keywords', addingKeyword.keywords);

	// const addngComment = await posts.addComment(post2._id.toString(), comment1._id.toString());
	// console.log('comments', addngComment.comments);

	await closeConnection();
}

await main();