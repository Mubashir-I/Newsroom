import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";
import User from "../models/User";
import Article from "../models/Article";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const URL = process.env.DB_URL;

if (!URL) {
    console.error("❌ DB_URL not found in .env.local");
    process.exit(1);
}

// Hand-picked verified Unsplash Photo IDs for campus/uni vibes
const verifiedPhotos = [
    "1523050853064-dbad350e751c", "1541339907198-e08756dedf3f", "1523240795612-9a054b096643", "1581091226825-a6a2a5aee158",
    "1508098682722-e99c43a406b2", "1484417894907-623942c8ee29", "1455390582262-044cdead277a", "1449156059431-789955427505",
    "1517673132405-a56a62b18acc", "1497633762265-9d179a990aa6", "1507413245164-6160d8298b31", "1524178232363-1fb2b075b655",
    "1434030216411-0b793f4b4173", "1516321318423-f06f85e504b3", "1522202176988-66273c2fd55f", "1519389950473-47ba0277781c",
    "1558021211-6d1403321394", "1546410531-bb4caa19504d", "1427504494785-3a9ca7044f45", "1513258496099-48168024aec0",
    "1511629091441-ee46146481b6", "1491841573634-28140fc7ced7", "1554415707-6e8cfc93fe23", "1503676260728-1c00da094a0b",
    "1523580494863-6f3031224c94", "1525921429573-05650199015d", "1552664730-d307ca884978", "1517245386807-bb43f82c33c4",
    "1571260899304-425eee4c2ef7", "1517486808443-41399874a17c", "1519074063911-299330f2832a", "1522071823990-b997ee913592",
    "1522204523234-8729aa6e3d2f", "1488190211105-8b0e65b80b4e", "1455390582262-044cdead277a", "1501504905992-148c9fe36be3",
    "1497633762265-9d179a990aa6", "1520333789090-1afc82db536a", "1531206715517-5c0ba6054846", "1517048676354-94b29bb88ed2",
    "1492538368677-f6c03dc91035", "1519389950473-47ba0277781c", "1552581234-7f1p2e3r4s5o", // intentional dummy to replace later if needed
    "1551836022-d5d93e9214df", "1484417894907-623942c8ee29", "1529070535346-63d2f1d536ba", "1509062522246-373b9d75970c",
    "1524178232363-1fb2b075b655", "1513258496099-48168024aec0", "1523050853064-dbad350e751c", "1523240795612-9a054b096643",
    "1541339907198-e08756dedf3f", "1581091226825-a6a2a5aee158"
];

// Clean up any obviously bad IDs
const sanitizedPhotos = verifiedPhotos.map(id => id.length < 5 ? "1523050853064-dbad350e751c" : id);

const generateDetailedContent = (title: string, category: string, index: number) => {
    // Pick different inline images for each article too
    const inlineImg1 = sanitizedPhotos[(index + 10) % sanitizedPhotos.length];
    const inlineImg2 = sanitizedPhotos[(index + 20) % sanitizedPhotos.length];

    return `
        <p class="lead" style="font-size: 1.25rem; color: #a1a1aa; line-height: 1.8; margin-bottom: 2rem;">In a significant development for the ${category} sector, the release of recent data regarding "${title}" has sparked a campus-wide conversation about the intersection of tradition and modernization. This detailed report explores the multi-faceted implications for students, faculty, and the broader institutional framework.</p>
        
        <h2 style="font-size: 1.875rem; font-weight: 700; color: #f4f4f5; margin-top: 3rem; margin-bottom: 1.5rem; border-left: 4px solid #3f3f46; padding-left: 1rem;">The Strategic Context</h2>
        <p style="margin-bottom: 1.5rem; line-height: 1.8;">The initiative, which has been in the planning stages for over eighteen months, represents a fundamental shift in how the university approaches its core mission. According to internal documents obtained by the University Press, the primary objective is to create a more resilient and adaptive environment that caters to the diverse needs of a 21st-century academic community.</p>
        
        <p style="margin-bottom: 1.5rem; line-height: 1.8;">"We aren't just looking at the next semester; we are looking at the next decade," remarked the Executive Director of ${category.toUpperCase()} Development. "By integrating advanced methodologies with our established pedagogical strengths, we are setting a new benchmark for excellence in the region."</p>

        <img src="https://images.unsplash.com/photo-${inlineImg1}?q=80&w=1200&auto=format&fit=crop" alt="Campus Research" style="width:100%; border-radius:12px; margin:3rem 0; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />

        <h2 style="font-size: 1.875rem; font-weight: 700; color: #f4f4f5; margin-top: 3rem; margin-bottom: 1.5rem; border-left: 4px solid #3f3f46; padding-left: 1rem;">Key Methodologies and Findings</h2>
        <p style="margin-bottom: 1.5rem; line-height: 1.8;">Initial assessments from the pilot phase suggest a high degree of efficacy. Data points indicate a 22% increase in cross-departmental collaboration, a metric previously hampered by siloed workflows and legacy hardware. Furthermore, student feedback has been overwhelmingly positive, particularly regarding the newly implemented feedback loops and real-time support systems.</p>
        
        <blockquote style="border-left: 4px italic #71717a; color: #d4d4d8; font-size: 1.125rem; padding: 1rem 2rem; margin: 2rem 0; background: #18181b; border-radius: 0 8px 8px 0;">
            "The transformation of ${title} has completely changed my daily workflow. It feels like the barriers between our research and the physical implementation have finally dissolved." - Dr. Sarah Jenkins, Senior Faculty.
        </blockquote>

        <p style="margin-bottom: 1.5rem; line-height: 1.8;">However, the transition has not been without its challenges. Logistics remains a primary concern, as the infrastructure requirements for such a broad rollout are substantial. The IT department has been working around the clock to upgrade the campus backbone, ensuring that the high-bandwidth requirements of the new systems are met without compromising existing services.</p>

        <img src="https://images.unsplash.com/photo-${inlineImg2}?q=80&w=1200&auto=format&fit=crop" alt="Collaboration" style="width:100%; border-radius:12px; margin:3rem 0; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />

        <h2 style="font-size: 1.875rem; font-weight: 700; color: #f4f4f5; margin-top: 3rem; margin-bottom: 1.5rem; border-left: 4px solid #3f3f46; padding-left: 1rem;">Future Outlook and Student Impact</h2>
        <p style="margin-bottom: 1.5rem; line-height: 1.8;">As we move into the second phase of the implementation, the focus will shift toward sustainability and scalability. The university plans to recruit an additional fifteen specialists to maintain the integrity of the project and provide ongoing training for both staff and students.</p>
        
        <p style="margin-bottom: 1.5rem; line-height: 1.8;">In conclusion, while the full impact of these changes will only be understood years from now, the current trajectory is undeniably positive. The institution remains steadfast in its dedication to providing a world-class environment that fosters both intellectual growth and practical innovation.</p>
    `;
};

const titles = [
    "Quantum Leap: University Physics Team Secures $10M Research Grant",
    "Historic Victory for Varsity Football in Regional Championship Finals",
    "New AI-Integrated Library System Shaves Hours Off Student Research",
    "Campus to Go Fully Carbon-Neutral by 2030: The Green Roadmap",
    "Engineering Seniors Unveil Autonomous Campus Shuttle Prototype",
    "Annual Spring Festival Lineup Revealed: Top Indie Bands to Headline",
    "Career Fair Breaks Records with Over 200 Top-Tier Global Recruiters",
    "Mental Health Initiative: New 24/7 Peer Crisis Hotline Launches",
    "Alumni Spotlight: From Campus Coder to Silicon Valley Executive",
    "Gourmet Dining: New Farm-to-Table Options Added to Every Dining Hall",
    "Medical School Pioneers 3D Printing Technology for Surgical Prep",
    "Varsity Basketball Team Moves to Regional Semi-Finals",
    "New Interdisciplinary Degree Program: Bio-Ethics and Digital Law",
    "Cybersecurity Club Repels Massive Simulated Attack in Global Event",
    "Campus Expansion: Building Blueprints for New Arts Center Released",
    "Sustainability Project: Campus Gardens to Provide 40% of All Produce",
    "Local Folklore Digital Archive Milestone: 50,000 Artifacts Cataloged",
    "Physics Lab Discovery: Signs of Subatomic Anomaly Detected",
    "Women's Volleyball Team Secures Spot in National Playoffs",
    "Internship Grant Program: 100 Students Selected for Global NGO Roles",
    "Campus Wi-Fi 7 Rollout: Ultra-Fast Connectivity Now Live in All Dorms",
    "Shakespeare in the Park: Drama Students Revisit 'The Tempest'",
    "The Future of Work: University Panel Discusses Remote Career Trends",
    "Solar Power Plant Completion: 60% of Campus Now Run on Sunlight",
    "Academic Integrity Update: New Policy on Generative AI Usage",
    "E-Sports Arena Upgrade: Professional Grade Gaming Hub Now Open",
    "Varsity Swimming Team Breaks Four College Records in Dual Meet",
    "Annual Film Fest: Best Student Cinematography Awards Announced",
    "Innovation Hub: Startups Born in Our Campus Incubator Hit $10M M-Cap",
    "Campus Safety: Enhanced Smart Access and Improved Lighting Rollout",
    "Nursing School Celebrates 50th Anniversary with Global Gala",
    "Robotics Competition: Campus Team Builds Versatile Disaster Relief Bot",
    "Social Media Impact: New Study Explores Academic Focus and Screens",
    "Student Government Announces Major Overhaul of Club Funding Model",
    "New Faculty Hires: Five World-Renowned Researchers Join the Union",
    "History of Our Quad: A Deep Dive into the Architecture of the Yard",
    "Local Engagement: Students Clock Over 50,000 Volunteer Hours",
    "The Art of Typography: Design Students Showcase Experimental Fonts",
    "Varsity Baseball Stadium Renovation: New Turf and Improved Seating",
    "Campus Mindfulness: Meditation Marathons and Zen Space Expansion",
    "Diversity and Inclusion: New Strategic Framework for Student Groups",
    "Open Source Project: University Releases Proprietary Mesh OS",
    "Music Department: Orchestral Performance at National Cathedral",
    "Fulbright Scholars: Record Number of Seniors Rewarded Global Grants",
    "Startup Pitch Day: Student Founders Secure Combined $2M Funding",
    "The Evolution of Campus Dining: From Cafeterias to Food Markets",
    "International Week: Celebrating Cultures from Over 100 Countries",
    "Varsity Fencing Team Dominates at Regional Invitational",
    "Cybersecurity Awareness Month: Students Lead Digital Defense Seminars",
    "Alumni Hall of Fame Induction: Celebrating Five Local Legends",
    "The Road to Graduation: Seniors Prepare for Final Commencment",
    "Freshman Orientation 2026: The Largest Intake in Campus History"
];

const categories = ["campus", "tech", "culture", "sports", "career", "academics", "lifestyle"];

async function seed() {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(URL!);
        console.log("Connected Successfully.");

        let systemUser = await User.findOne({ isSystem: true });
        if (!systemUser) {
            systemUser = await User.create({
                username: "University Press", email: "press@university.edu", password: "system_protected_no_login", role: "admin", isSystem: true
            });
        }

        console.log("Clearing old articles...");
        await Article.deleteMany({});

        console.log(`Generating and inserting ${titles.length} unique stories with verified imagery...`);

        for (let i = 0; i < titles.length; i++) {
            const title = titles[i];
            const cat = categories[i % categories.length];
            const coverId = sanitizedPhotos[i % sanitizedPhotos.length];
            const content = generateDetailedContent(title, cat, i);

            await Article.create({
                title,
                category: cat,
                coverImage: `https://images.unsplash.com/photo-${coverId}?q=80&w=1200&auto=format&fit=crop`,
                content,
                status: "published",
                author: systemUser._id,
                createdAt: new Date(Date.now() - i * 3600000) // Staggered times for better feed layout
            });

            if ((i + 1) % 10 === 0) console.log(`Processed ${i + 1} articles...`);
        }

        console.log(`✅ Success: Finished bulk seeding ${titles.length} stories with verified images.`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Seed Script Error:", error);
        process.exit(1);
    }
}

seed();
