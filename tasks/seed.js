/*
Populate data and test
*/

import { dbConnection, closeConnection } from ".././config/mongoConnections.js";
import { userData, postData, commentData, reportData, keywordData, algoData } from "../data/index.js";

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
	//create admin user
	// const adminUser = await userData.createAdmin(
	// 	"Admin",
	// 	"Password1!",
	// 	"/uploads/pfp.jpg",
	// 	Math.floor(Math.random() * (75 - 13 + 1)) + 13,
	// 	"Hi, I'm the admin user for this site!"
	// );
	// Create users
    const user1 = await userData.createUser(
        "EthanSilv",
        "Password1!",
        "/uploads/smile.jpg",
        Math.floor(Math.random() * (75 - 13 + 1)) + 13,
        "Hi, I love fashion and posting my outfits!"
    );
    const user2 = await userData.createUser(
		"Fashionista123",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Fashion enthusiast with a passion for style and trends!"
	);
	const user3 = await userData.createUser(
		"StyleGuru24",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Sharing my love for fashion and inspiring others to find their own unique style."
	);
	const user4 = await userData.createUser(
		"VintageVibes77",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Obsessed with all things vintage and retro!"
	);
	const user5 = await userData.createUser(
		"StreetwearStar",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Bringing streetwear to the forefront of fashion."
	);
	const user6 = await userData.createUser(
		"MinimalistMaven",
		generatePassword(),
		"smile.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Less is more. Embracing the beauty of minimalism in fashion and life."
	);
	const user7 = await userData.createUser(
		"BohemianBeauty",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Free-spirited and eclectic, with a love for bohemian fashion."
	);
	const user8 = await userData.createUser(
		"ClassicChic",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Timeless elegance and sophistication are my style staples."
	);
	const user9 = await userData.createUser(
		"AthleisureAddict",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Living in athleisure and loving it! Comfort and style combined."
	);
	const user10 = await userData.createUser(
		"SustainableStyle",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Promoting sustainable and ethical fashion choices."
	);
    const user11 = await userData.createUser(
		"GlamourGirl",
		generatePassword(),
		"/uploads/smile.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Adding a touch of glamour to every outfit."
	);
    const user12 = await userData.createUser(
		"PreppyPrincess",
		generatePassword(),
		"/uploads/pikachu.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Embracing the preppy aesthetic with classic and polished looks."
	);
    const user13 = await userData.createUser(
		"RockerEdge",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Adding a rocker edge to my wardrobe with leather jackets and band tees."
	);
    const user14 = await userData.createUser(
		"GirlyGlam",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"All about girly and glamorous fashion choices."
	);
    const user15 = await userData.createUser(
		"TomboyTrend",
		generatePassword(),
		"/uploads/pikachu.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Mixing tomboy style with trendy pieces for a unique look."
	);
    const user16 = await userData.createUser(
		"ArtsyAttire",
		generatePassword(),
		"/uploads/smile.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Expressing myself through my artsy and creative fashion choices."
	);
    const user17 = await userData.createUser(
		"EdgyEnsembles",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Pushing the boundaries with edgy and daring ensembles."
	);
    const user18 = await userData.createUser(
		"ComfyCasual",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Keeping it comfy and casual with my everyday outfits."
	);
    const user19 = await userData.createUser(
		"ChicAndSophistic",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Aiming for chic and sophisticated style in all my looks."
	);
    const user20 = await userData.createUser(
		"TrendsetExtr0",
		generatePassword(),
		"/uploads/pikachu.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Setting trends and inspiring others with my bold fashion choices."
	);
    const user21 = await userData.createUser(
		"VintageVogue",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Mixing vintage finds with modern pieces for a unique and stylish look."
	);
    const user22 = await userData.createUser(
		"StreetStylSav",
		generatePassword(),
		"/uploads/smile.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Mastering the art of street style with effortless cool."
	);
    const user23 = await userData.createUser(
		"MinimalistM8",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Keeping it simple and stylish with a minimalist approach to fashion."
	);
    const user24 = await userData.createUser(
		"BohoBabe",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Embracing the boho lifestyle with flowy fabrics and earthy tones."
	);
    const user25 = await userData.createUser(
		"ClassicCouture",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Investing in classic pieces that never go out of style."
	);
    const user26 = await userData.createUser(
		"SportySpice",
		generatePassword(),
		"/uploads/smile.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Mixing sporty and stylish pieces for a comfortable and chic look."
	);
    const user27 = await userData.createUser(
		"EcoFashionista",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Making sustainable fashion choices that are good for the planet and my wardrobe."
	);
    const user28 = await userData.createUser(
		"HollywoodGlam",
		generatePassword(),
		"/uploads/pikachu.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Channeling old Hollywood glamour with elegant and sophisticated looks."
	);
    const user29 = await userData.createUser(
		"PreppyPerfect",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Perfecting the preppy look with classic pieces and bold colors."
	);
    const user30 = await userData.createUser(
		"RockstarStyle",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Rocking out in style with edgy and rebellious fashion choices."
	);
    const user31 = await userData.createUser(
		"GirlyGirl",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Embracing my feminine side with girly and glamorous outfits."
	);
    const user32 = await userData.createUser(
		"TomboyChic",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Mixing tomboy style with chic pieces for a cool and effortless look."
	);
    const user33 = await userData.createUser(
		"CreativeCouture",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Expressing my creativity through my unique and artistic fashion choices."
	);
    const user34 = await userData.createUser(
		"DaringDresser",
		generatePassword(),
		"/uploads/smile.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Taking fashion risks and experimenting with bold and daring looks."
	);
    const user35 = await userData.createUser(
		"CasualCool",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Keeping it casual and cool with my everyday style."
	);
    const user36 = await userData.createUser(
		"SophistStyl",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Elevating my wardrobe with sophisticated and timeless pieces."
	);
    const user37 = await userData.createUser(
		"FashionForward",
		generatePassword(),
		"/uploads/pikachu.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Staying ahead of the trends and embracing fashion-forward looks."
	);
    const user38 = await userData.createUser(
		"RetroRevival",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Bringing back retro styles with a modern twist."
	);
    const user39 = await userData.createUser(
		"UrbanEdge",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Adding an urban edge to my outfits with streetwear-inspired pieces."
	);
    const user40 = await userData.createUser(
		"SimpleAndChic",
		generatePassword(),
		"/uploads/pikachu.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Keeping it simple and chic with my minimalist wardrobe."
	);
    const user41 = await userData.createUser(
		"BohemianSpirit",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Expressing my bohemian spirit through my free-flowing and eclectic style."
	);
    const user42 = await userData.createUser(
		"TimelessTaste",
		generatePassword(),
		"/uploads/smile.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Investing in timeless pieces that will last for years to come."
	);
    const user43 = await userData.createUser(
		"ActivaterBobby",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Staying active and stylish with my athleisure-inspired looks."
	);
    const user44 = await userData.createUser(
		"Lilyann",
		generatePassword(),
		"/uploads/pikachu.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Making conscious fashion choices that are good for the environment and the people who make my clothes."
	);
    const user45 = await userData.createUser(
		"GlamGoddess",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Adding a touch of glam to my everyday outfits."
	);
    const user46 = await userData.createUser(
		"GeorgeHarr",
		generatePassword(),
		"/uploads/smile.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Keeping it polished and preppy with my classic and timeless style."
	);
    const user47 = await userData.createUser(
		"RebelWithStyle",
		generatePassword(),
		"/uploads/pikachu.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Adding a rebellious edge to my outfits with rocker-inspired pieces."
	);
    const user48 = await userData.createUser(
		"FeminineFashion",
		generatePassword(),
		"/uploads/pikachu.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Embracing my femininity with girly and glamorous fashion choices."
	);
    const user49 = await userData.createUser(
		"CoolAndCasual",
		generatePassword(),
		"/uploads/pfp.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Keeping it cool and casual with my effortless style."
	);
    const user50 = await userData.createUser(
		"ArtsyAndUnique",
		generatePassword(),
		"/uploads/pikachu.jpg",
		Math.floor(Math.random() * (75 - 13 + 1)) + 13,
		"Expressing my artistic side through my unique and creative fashion choices."
	);

	// Create posts
	const post1 = await postData.createPost(
		user1._id,
		"../uploads/image.png",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["classic", "minimalist"],
		"A classic style with great minimalist qualities"
	);
	const post2 = await postData.createPost(
		user1._id,
		"../uploads/dress.jpg",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Trendy", "Urban", "Chic"],
		"Rocking the latest trends on the city streets"
	);
	const post3 = await postData.createPost(
		user1._id,
		"../uploads/suit.jpg",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Classic", "Elegant", "Timeless"],
		"Classic elegance never goes out of style"
	);
	const post4 = await postData.createPost(
		user2._id,
		"../uploads/trendy.jpg",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Sporty", "Athleisure", "Comfortable"],
		"Staying comfy and stylish in my athleisure wear Yasss"
	);
	const post5 = await postData.createPost(
		user2._id,
		"../uploads/casual.jpg",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Vintage", "Retro", "Unique"],
		"Found the perfect vintage piece to add to my collection"
	);
	const post6 = await postData.createPost(
		user2._id,
		"../uploads/spring.jpg",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Minimalist", "Simple", "Chic"],
		"Less is more Embracing the beauty of minimalism in fashion"
	);
	const post7 = await postData.createPost(
		user3._id,
		"../uploads/sportsfan.jpg",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html",],
		["Bohemian", "Vintage", "Earthy"],
		"Flowy fabrics and earthy tones for the bohemian soul"
	);
	const post8 = await postData.createPost(
		user3._id,
		"../uploads/culture.jpg",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Classic", "Elegant", "Timeless"],
		"Timeless elegance and sophistication are my style staples"
	);
	const post9 = await postData.createPost(
		user4._id,
		"../uploads/nyc.jpg",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Athleisure", "Sporty", "Comfortable"],
		"Living in athleisure and loving it Comfort and style combined"
	);
	const post10 = await postData.createPost(
		user4._id,
		"../uploads/casual.jpg",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Sustainable", "Ethical", "Casual"],
		"Promoting sustainable and ethical fashion choices. #sustainablefashion"
	);
	const post11 = await postData.createPost(
		user5._id,
		"../uploads/nyc.jpg",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Glamorous", "Chic", "Sparkly"],
		"Adding a touch of glamour to every outfit. #glamstyle"
	);
	const post12 = await postData.createPost(
		user6._id,
		"../uploads/sportsfan.jpg",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Preppy", "Classic", "Polished"],
		"Embracing the preppy aesthetic with classic and polished looks. #preppystyle"
	);
	const post13 = await postData.createPost(
		user6._id,
		"../uploads/suit.jpg",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Rocker", "Edgy", "Rebellious"],
		"Adding a rocker edge to my wardrobe with leather jackets and band tees. #rockerstyle"
	);
	const post14 = await postData.createPost(
		user7._id,
		"../uploads/casual.jpg",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Girly", "Glamorous", "Feminine"],
		"All about girly and glamorous fashion choices. #girlyglam"
	);
	const post15 = await postData.createPost(
		user7._id,
		"../uploads/culture.jpg",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Tomboy", "Trendy", "Casual"],
		"Mixing tomboy style with trendy pieces for a unique look. #tomboychic"
	);
	const post16 = await postData.createPost(
		user7._id,
		"../uploads/trendy.jpg",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Artsy", "Creative", "Unique"],
		"Expressing myself through my artsy and creative fashion choices. #artsyfashion"
	);
	const post17 = await postData.createPost(
		user8._id,
		"../uploads/dress.jpg",
		["https://www.hanes.com/hanes-classic-mens-white-crew-neck-t-shirt-p6.html"],
		["Edgy", "Daring", "Bold"],
		"Pushing the boundaries with edgy and daring ensembles. #edgystyle"
	);
	const post18 = await postData.createPost(
		user9._id,
		"../uploads/dress.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Casual", "Comfortable", "Relaxed"],
		"Keeping it comfy and casual with my everyday outfits. #casualstyle"
	);
	const post19 = await postData.createPost(
		user9._id,
		"../uploads/nyc.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Chic", "Sophisticated", "Elegant"],
		"Aiming for chic and sophisticated style in all my looks. #chicstyle"
	);
	const post20 = await postData.createPost(
		user10._id,
		"../uploads/sportsfan.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Trendy", "Bold", "Vintage"],
		"Setting trends and inspiring others with my bold fashion choices. #trendsetter"
	);
	const post21 = await postData.createPost(
		user10._id,
		"../uploads/casual.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Vintage", "Modern", "Unique"],
		"Mixing vintage finds with modern pieces for a unique and stylish look. #vintagefashion"
	);
	const post22 = await postData.createPost(
		user10._id,
		"../uploads/spring.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Streetstyle", "Urban", "Cool"],
		"Mastering the art of street style with effortless cool. #streetstylesavvy"
	);
	const post23 = await postData.createPost(
		user11._id,
		"../uploads/culture.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Minimalist", "Simple", "Understated"],
		"Keeping it simple and stylish with a minimalist approach to fashion. #minimalistmaster"
	);
	const post24 = await postData.createPost(
		user12._id,
		"../uploads/casual.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Bohemian", "Flowy", "Earthy"],
		"Embracing the boho lifestyle with flowy fabrics and earthy tones. #bohobabe"
	);
	const post25 = await postData.createPost(
		user12._id,
		"../uploads/outfit.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Classic", "Timeless", "Sophisticated"],
		"Investing in classic pieces that never go out of style. #classiccouture"
	);
	const post26 = await postData.createPost(
		user13._id,
		"../uploads/casual.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Rocker", "Edgy", "Rebellious"],
		"Adding a rocker edge to my wardrobe with leather jackets and band tees. #rockerstyle"
	);
	const post27 = await postData.createPost(
		user13._id,
		"../uploads/dress.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Grunge", "Dark", "Alternative"], 
		"Embracing my inner grunge with dark and edgy pieces. #grungestyle"
	);
	const post28 = await postData.createPost(
		user14._id,
		"../uploads/sportsfan.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Girly", "Glamorous", "Feminine"],
		"All about girly and glamorous fashion choices. #girlyglam"
	);
	const post29 = await postData.createPost(
		user14._id,
		"../uploads/spring.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Trendy", "Chic", "Colorful"],
		"Loving these bright and trendy pieces! #fashionlover"
	);
	const post30 = await postData.createPost(
		user15._id,
		"../uploads/culture.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Tomboy", "Trendy", "Casual"],
		"Mixing tomboy style with trendy pieces for a unique look. #tomboychic" 
	);
	const post31 = await postData.createPost(
		user16._id,
		"../uploads/dress.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Artsy", "Creative", "Unique"],
		"Expressing myself through my artsy and creative fashion choices. #artsyfashion"
	);
	const post32 = await postData.createPost( 
		user16._id,
		"../uploads/dress.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Bohemian", "Flowy", "Colorful"], 
		"Adding a touch of bohemian flair to my wardrobe. #bohovibes" 
	);
	const post33 = await postData.createPost(
		user17._id,
		"../uploads/nyc.jpg", 
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Edgy", "Daring", "Bold"],
		"Pushing the boundaries with edgy and daring ensembles. #edgystyle" 
	);
	const post34 = await postData.createPost( 
		user18._id,
		"../uploads/spring.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Casual", "Comfortable", "Relaxed"],
		"Keeping it comfy and casual with my everyday outfits. #casualstyle"
	); 
	const post35 = await postData.createPost(
		user18._id,
		"../uploads/spring.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Sporty", "Athleisure", "Active"],
		"Staying active and stylish in my athleisure wear. #sportystyle" 
	); 
	const post36 = await postData.createPost(
		user19._id,
		"../uploads/dress.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Chic", "Sophisticated", "Elegant"], 
		"Aiming for chic and sophisticated style in all my looks. #chicstyle"
	);
	const post37 = await postData.createPost(
		user20._id,
		"../uploads/nyc.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Trendy", "Bold", "Vintage"],
		"Setting trends and inspiring others with my bold fashion choices. #trendsetter"
	);
	const post38 = await postData.createPost(
		user21._id,
		"../uploads/casual.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Vintage", "Modern", "Unique"], 
		"Mixing vintage finds with modern pieces for a unique and stylish look. #vintagefashion"
	);
	const post39 = await postData.createPost(
		user22._id,
		"../uploads/cool.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Streetstyle", "Urban", "Cool"], 
		"Mastering the art of street style with effortless cool. #streetstylesavvy" 
	);
	const post40 = await postData.createPost(
		user23._id, 
		"../uploads/dress.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Minimalist", "Simple", "Understated"],
		"Keeping it simple and stylish with a minimalist approach to fashion. #minimalistmaster"
	);
	const post41 = await postData.createPost(
		user24._id, 
		"../uploads/nyc.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Bohemian", "Flowy", "Earthy"],
		"Embracing the boho lifestyle with flowy fabrics and earthy tones. #bohobabe" 
	);
	const post42 = await postData.createPost( 
		user25._id,
		"../uploads/spring.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Classic", "Timeless", "Sophisticated"],
		"Investing in classic pieces that never go out of style. #classiccouture" 
	);
	const post43 = await postData.createPost(
		user26._id, 
		"../uploads/cool.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Sporty", "Stylish", "Comfortable"], 
		"Mixing sporty and stylish pieces for a comfortable and chic look. #sportyspice" 
	);
	const post44 = await postData.createPost( 
		user26._id,
		"../uploads/spring.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Athleisure", "Trendy", "Functional"], 
		"Loving the athleisure trend for its comfort and style. #athleisurelover" 
	); 
	const post45 = await postData.createPost(
		user27._id,
		"../uploads/nyc.jpg", 
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Sustainable", "Ethical", "Vintage"], 
		"Making sustainable fashion choices that are good for the planet and my wardrobe. #sustainablefashionista"
	);
	const post46 = await postData.createPost( 
		user28._id,
		"../uploads/cool.jpg", 
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Glamorous", "Hollywood", "Elegant"], 
		"Channeling old Hollywood glamour with elegant and sophisticated looks. #hollywoodglam"
	);
	const post47 = await postData.createPost( 
		user29._id,
		"../uploads/trendy.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Preppy", "Classic", "Polished"],
		"Perfecting the preppy look with classic pieces and bold colors. #preppyperfection"
	); 
	const post48 = await postData.createPost(
		user29._id, 
		"../uploads/cool.jpg", 
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Nautical", "Stripes", "Summery"], 
		"Loving the nautical vibes for summer! #nauticalstyle"
	);
	const post49 = await postData.createPost(
		user30._id, 
		"../uploads/nyc.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Rockstar", "Edgy", "Rebellious"], 
		"Rocking out in style with edgy and rebellious fashion choices. #rockstarstyle" 
	);
	const post50 = await postData.createPost( 
		user30._id,
		"../uploads/sportsfan.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Leather", "Black", "Bold"], 
		"Adding a touch of leather to my look for an edgy vibe. #leatherlover"
	);
	const post51 = await postData.createPost(
		user30._id,
		"../uploads/spring.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Vintage", "Music", "Casual"], 
		"Expressing my love for music through band tees and casual style. #bandteestyle" 
	);
	const post52 = await postData.createPost( 
		user31._id,
		"../uploads/cool.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Girly", "Pink", "Feminine"], 
		"Embracing my feminine side with girly and pink outfits. #girlygirl"
	);
	const post53 = await postData.createPost( 
		user32._id,
		"../uploads/trendy.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Tomboy", "Chic", "Effortless"],
		"Mixing tomboy style with chic pieces for a cool and effortless look. #tomboychic" 
	); 
	const post54 = await postData.createPost(
		user33._id,
		"../uploads/cool.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Creative", "Unique", "Colorful"],
		"Expressing my creativity through my unique and artistic fashion choices. #creativecouture"
	); 
	const post55 = await postData.createPost(
		user34._id, 
		"../uploads/nyc.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Daring", "Bold", "Experimental"],
		"Taking fashion risks and experimenting with bold and daring looks. #daringdresser" 
	); 
	const post56 = await postData.createPost(
		user34._id, 
		"../uploads/culture.jpg", 
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Vintage", "Unique", "Retro"], 
		"Pushing the boundaries of fashion with avant-garde and unique pieces. #avantgardestyle"
	);
	const post57 = await postData.createPost( 
		user35._id, 
		"../uploads/sportsfan.jpg", 
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"],
		["Casual", "Denim", "Comfortable"], 
		"Keeping it casual and cool with my favorite denim pieces. #casualcool"
	); 
	const post58 = await postData.createPost(
		user36._id,
		"../uploads/cool.jpg",
		["https://www.abercrombie.com/shop/us/womens-bottoms-classic-jeans-jeans"], 
		["Sophisticated", "Timeless", "Elegant"],
		"Elevating my wardrobe with sophisticated and timeless pieces. #sophisticatedstyle" 
	);
	const post59 = await postData.createPost(
		user36._id,
		"../uploads/nyc.jpg",
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Tailored", "Chic", "Polished"], 
		"Loving the look of tailored pieces for a chic and polished style. #tailoredstyle"
	);
	const post60 = await postData.createPost(
		user37._id, 
		"../uploads/cool.jpg",
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Retro", "Trendy", "Unique"],
		"Staying ahead of the trends and embracing fashion-forward looks. #fashionforward"
	);
	const post61 = await postData.createPost( 
		user37._id, 
		"../uploads/trendy.jpg",
		["https://www.fairharborclothing.com/collections/mens-swim-1"], 
		["Streetwear", "Urban", "Sporty"],
		"Mixing streetwear and sporty pieces for a cool and urban look. #urbanstyle"
	); 
	const post62 = await postData.createPost( 
		user37._id,
		"../uploads/sportsfan.jpg", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Minimalist", "Monochrome", "Chic"], 
		"Keeping it simple and chic with a minimalist and monochrome palette. #minimalistchic" 
	);
	const post63 = await postData.createPost( 
		user38._id,
		"../uploads/nyc.jpg", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Retro", "Vintage", "Colorful"],
		"Bringing back retro styles with a modern twist. #retrorevival"
	); 
	const post64 = await postData.createPost( 
		user38._id, 
		"../uploads/culture.jpg",
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Denim", "Casual", "Classic"],
		"Denim is always a classic choice for a casual and cool look. #denimlover"
	);
	const post65 = await postData.createPost(
		user39._id, 
		"../uploads/cool.jpg", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Urban", "Streetwear", "Edgy"], 
		"Adding an urban edge to my outfits with streetwear-inspired pieces. #urbanedge"
	);
	const post66 = await postData.createPost( 
		user39._id, 
		"../uploads/nyc.jpg",
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Urban", "Statement", "Casual"],
		"Making a statement with graphic tees and casual style. #graphicteestyle"
	); 
	const post67 = await postData.createPost(
		user40._id, 
		"../uploads/image.png", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Minimalist", "Neutral", "Timeless"],
		"Keeping it simple and chic with a minimalist wardrobe in neutral tones. #simpleandchic"
	); 
	const post68 = await postData.createPost(
		user41._id,
		"../uploads/cool.jpg", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"], 
		["Bohemian", "Flowy", "Eclectic"], 
		"Expressing my bohemian spirit through my free-flowing and eclectic style. #bohemianspirit"
	);
	const post69 = await postData.createPost(
		user41._id, 
		"../uploads/trendy.jpg",
		["https://www.fairharborclothing.com/collections/mens-swim-1"], 
		["Athletic", "Summery", "Comfortable"],
		"Loving the comfort and style of maxi dresses for summer. #maxidresslover" 
	);
	const post70 = await postData.createPost(
		user42._id,
		"../uploads/cool.jpg",
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Classic", "Timeless", "Investment"], 
		"Investing in timeless pieces that will last for years to come. #timelesstaste" 
	);
	const post71 = await postData.createPost(
		user43._id,
		"../uploads/suit.jpg", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Active", "Sporty", "Athleisure"],
		"Staying active and stylish with my athleisure-inspired looks. #activeandstylish" 
	);
	const post72 = await postData.createPost(
		user43._id, 
		"../uploads/culture.jpg", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Sneakers", "Comfortable", "Casual"],
		"Sneakers are my go-to for comfort and casual style. #sneakerhead" 
	); 
	const post73 = await postData.createPost( 
		user44._id, 
		"../uploads/suit.jpg",
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Sustainable", "Ethical", "Conscious"], 
		"Making conscious fashion choices that are good for the environment and the people who make my clothes. #consciousconsumer"
	);
	const post74 = await postData.createPost( 
		user44._id,
		"../uploads/sportsfan.jpg",
		["https://www.fairharborclothing.com/collections/mens-swim-1"], 
		["Vintage", "Retro", "Comfortable"], 
		"Choosing eco-friendly clothing made from natural fabrics for comfort and sustainability. #ecofashion"
	); 
	const post75 = await postData.createPost(
		user45._id,
		"../uploads/cool.jpg", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Glamorous", "Sparkly", "Chic"], 
		"Adding a touch of glam to my everyday outfits. #glamgoddess"
	); 
	const post76 = await postData.createPost(
		user45._id,
		"../uploads/suit.jpg", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Sequins", "Party", "Festive"],
		"Bringing on the sparkle with sequins for a party-ready look. #sequinslover" 
	);
	const post77 = await postData.createPost( 
		user46._id, 
		"../uploads/culture.jpg",
		["https://www.fairharborclothing.com/collections/mens-swim-1"], 
		["Preppy", "Classic", "Timeless"], 
		"Keeping it polished and preppy with my classic and timeless style. #polishedandpreppy"
	);
	const post78 = await postData.createPost(
		user47._id,
		"../uploads/trendy.jpg", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"], 
		["Rebellious", "Edgy", "Leather"],
		"Adding a rebellious edge to my outfits with rocker-inspired pieces. #rebelwithstyle"
	); 
	const post79 = await postData.createPost(
		user48._id,
		"../uploads/culture.jpg",
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Feminine", "Floral", "Romantic"], 
		"Embracing my femininity with floral and romantic pieces. #femininefashion"
	);
	const post80 = await postData.createPost( 
		user49._id,
		"../uploads/suit.jpg",
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Casual", "Effortless", "Cool"],
		"Keeping it cool and casual with my effortless style. #casualcool" 
	);
	const post81 = await postData.createPost( 
		user50._id,
		"../uploads/sportsfan.jpg", 
		["https://www.fairharborclothing.com/collections/mens-swim-1"],
		["Artistic", "Unique", "Creative"], 
		"Expressing my artistic side through my unique and creative fashion choices. #artsyandunique" 
	);
	// Create comments

	const comment1 = await commentData.create(post1._id, user1._id, "Love this");
	const comment2 = await commentData.create(post1._id,user2._id,"Cool Outfit!");
	const comment3 = await commentData.create(post2._id, user17._id, "Amazing!");
	const comment4 = await commentData.create(post3._id, user42._id, "Where did you get that?");
	const comment5 = await commentData.create(post3._id, user3._id, "I need this in my life!"); 
	const comment6 = await commentData.create(post4._id, user50._id, "Lovely");
	const comment7 = await commentData.create(post5._id, user7._id, "So cool!"); 
	const comment8 = await commentData.create(post6._id, user1._id, "Love your style!");
	const comment9 = await commentData.create(post7._id, user22._id, "Beautiful!");
	const comment10 = await commentData.create(post8._id, user31._id, "Looking good!");
	const comment11 = await commentData.create(post8._id, user4._id, "Wow!"); 
	const comment12 = await commentData.create(post9._id, user19._id, "You're an inspiration!");
	const comment13 = await commentData.create(post10._id, user2._id, "Very nice!"); 
	const comment14 = await commentData.create(post11._id, user44._id, "Love it!");
	const comment15 = await commentData.create(post11._id, user15._id, "So pretty!");
	const comment16 = await commentData.create(post12._id, user28._id, "Stunning!"); 
	const comment17 = await commentData.create(post13._id, user33._id, "Goals!"); 
	const comment18 = await commentData.create(post14._id, user9._id, "Fantastic!");
	const comment19 = await commentData.create(post15._id, user39._id, "Amazing shot!"); 
	const comment20 = await commentData.create(post15._id, user11._id, "Great photo!");
	const comment21 = await commentData.create(post16._id, user45._id, "Well done!");
	const comment22 = await commentData.create(post17._id, user27._id, "Excellent work!"); 
	const comment23 = await commentData.create(post18._id, user13._id, "You're so talented!"); 
	const comment24 = await commentData.create(post19._id, user20._id, "Keep it up!");
	const comment25 = await commentData.create(post20._id, user35._id, "Perfect!"); 
	const comment26 = await commentData.create(post21._id, user49._id, "I love this!"); 
	const comment27 = await commentData.create(post22._id, user18._id, "This is great!"); 
	const comment28 = await commentData.create(post23._id, user41._id, "Super!"); 
	const comment29 = await commentData.create(post23._id, user6._id, "Wonderful!");
	const comment30 = await commentData.create(post24._id, user26._id, "Spectacular!");
	const comment31 = await commentData.create(post25._id, user34._id, "Nice one!");
	const comment32 = await commentData.create(post26._id, user5._id, "Awesome!");
	const comment33 = await commentData.create(post26._id, user25._id, "Rad!");
	const comment34 = await commentData.create(post27._id, user43._id, "Breathtaking!"); 
	const comment35 = await commentData.create(post28._id, user12._id, "You're a star!"); 
	const comment36 = await commentData.create(post29._id, user30._id, "Killing it!");
	const comment37 = await commentData.create(post30._id, user48._id, "Get it!"); 
	const comment38 = await commentData.create(post31._id, user10._id, "Woohoo!"); 
	const comment39 = await commentData.create(post31._id, user21._id, "Yes!"); 
	const comment40 = await commentData.create(post32._id, user38._id, "Way to go!"); 
	const comment41 = await commentData.create(post33._id, user16._id, "You rock!");
	const comment42 = await commentData.create(post34._id, user29._id, "Congrats!");
	const comment43 = await commentData.create(post35._id, user46._id, "Boom!");
	const comment44 = await commentData.create(post35._id, user8._id, "Yas!");
	const comment45 = await commentData.create(post36._id, user32._id, "Amazing job!");
	const comment46 = await commentData.create(post37._id, user40._id, "Nailed it!"); 
	const comment47 = await commentData.create(post38._id, user24._id, "Impressive!"); 
	const comment48 = await commentData.create(post39._id, user47._id, "Phenomenal!");
	const comment49 = await commentData.create(post40._id, user14._id, "Outstanding!"); 
	const comment50 = await commentData.create(post41._id, user36._id, "Bravo!"); 

	//create likes
	const like1 = await postData.addLike(user1._id.toString(), post1._id.toString());
	const like2 = await postData.addLike(user2._id.toString(), post1._id.toString());
	const like3 = await postData.addLike(user7._id.toString(), post67._id.toString());
	const like4 = await postData.addLike(user2._id.toString(), post15._id.toString());
	const like5 = await postData.addLike(user42._id.toString(), post81._id.toString());
	const like6 = await postData.addLike(user37._id.toString(), post4._id.toString());
	const like7 = await postData.addLike(user11._id.toString(), post55._id.toString());
	const like8 = await postData.addLike(user28._id.toString(), post27._id.toString());
	const like9 = await postData.addLike(user49._id.toString(), post19._id.toString());
	const like10 = await postData.addLike(user15._id.toString(), post63._id.toString());
	const like11= await postData.addLike(user3._id.toString(), post78._id.toString());
	const like12 = await postData.addLike(user26._id.toString(), post51._id.toString());
	const like13 = await postData.addLike(user47._id.toString(), post39._id.toString());
	const like14 = await postData.addLike(user18._id.toString(), post2._id.toString());
	const like15 = await postData.addLike(user34._id.toString(), post44._id.toString());
	const like16 = await postData.addLike(user21._id.toString(), post77._id.toString());
	const like17 = await postData.addLike(user9._id.toString(), post13._id.toString());
	const like18 = await postData.addLike(user39._id.toString(), post59._id.toString());
	const like19 = await postData.addLike(user2._id.toString(), post22._id.toString());
	const like20 = await postData.addLike(user45._id.toString(), post68._id.toString());
	const like21 = await postData.addLike(user30._id.toString(), post7._id.toString());
	const like22 = await postData.addLike(user14._id.toString(), post40._id.toString());
	const like23 = await postData.addLike(user43._id.toString(), post29._id.toString());
	const like24 = await postData.addLike(user10._id.toString(), post76._id.toString());
	const like25 = await postData.addLike(user36._id.toString(), post52._id.toString());
	const like26 = await postData.addLike(user25._id.toString(), post16._id.toString());
	const like27 = await postData.addLike(user8._id.toString(), post64._id.toString());
	const like28 = await postData.addLike(user41._id.toString(), post35._id.toString());
	const like29 = await postData.addLike(user17._id.toString(), post80._id.toString());
	const like30 = await postData.addLike(user33._id.toString(), post56._id.toString());
	const like31 = await postData.addLike(user20._id.toString(), post9._id.toString());
	const like32 = await postData.addLike(user48._id.toString(), post41._id.toString());
	const like33 = await postData.addLike(user13._id.toString(), post24._id.toString());
	const like34 = await postData.addLike(user38._id.toString(), post71._id.toString());
	const like35 = await postData.addLike(user7._id.toString(), post5._id.toString());
	const like36 = await postData.addLike(user46._id.toString(), post32._id.toString());
	const like37 = await postData.addLike(user12._id.toString(), post79._id.toString());
	const like38 = await postData.addLike(user35._id.toString(), post53._id.toString());
	const like39 = await postData.addLike(user22._id.toString(), post18._id.toString());
	const like40 = await postData.addLike(user50._id.toString(), post66._id.toString());
	const like41 = await postData.addLike(user16._id.toString(), post3._id.toString());
	const like42 = await postData.addLike(user44._id.toString(), post25._id.toString());
	const like43 = await postData.addLike(user6._id.toString(), post70._id.toString());
	const like44 = await postData.addLike(user31._id.toString(), post57._id.toString());
	const like45 = await postData.addLike(user24._id.toString(), post11._id.toString());
	const like46 = await postData.addLike(user40._id.toString(), post61._id.toString());
	const like47 = await postData.addLike(user4._id.toString(), post30._id.toString());
	const like48 = await postData.addLike(user29._id.toString(), post75._id.toString());
	const like49 = await postData.addLike(user1._id.toString(), post50._id.toString());
	const like50 = await postData.addLike(user27._id.toString(), post20._id.toString());
	
	//create report
	const report1 = await reportData.createReport(post1._id,"ClassicChic","Profanity in the caption");
	const report3 = await reportData.createReport(post1._id,"MinimalistMaven","Profanity in the caption");
	const report2 = await reportData.createReport(post15._id,"MinimalistMaven","This outfit is really ugly");
	
	//set admin
	const admin = await userData.setAdminStatus(user1._id.toString(),true);

	//set followers
	const follower1 = await userData.addFollower(user1._id.toString(),user2._id.toString());
	const follower2 = await userData.addFollower(user19._id.toString(),user26._id.toString());
	const follower3 = await userData.addFollower(user13._id.toString(),user2._id.toString());
	const follower4 = await userData.addFollower(user30._id.toString(),user2._id.toString());
	const follower5 = await userData.addFollower(user5._id.toString(),user1._id.toString());
	const follower6 = await userData.addFollower(user22._id.toString(),user6._id.toString());
	const follower7 = await userData.addFollower(user1._id.toString(),user8._id.toString());
	const follower8 = await userData.addFollower(user9._id.toString(),user2._id.toString());
	const follower9 = await userData.addFollower(user44._id.toString(),user21._id.toString());
	const follower10 = await userData.addFollower(user1._id.toString(),user27._id.toString());
	console.log("Done seeding database");
	await closeConnection();
}

await main();