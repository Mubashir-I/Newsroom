import { NextResponse } from "next/server";
import { DatabaseConnection } from "@/lib/Database";
import Article from "@/models/Article";
import User from "@/models/User";

export async function GET() {
    try {
        await DatabaseConnection();

        let scraperUser = await User.findOne({ email: "bot@newsroom.edu" });
        if (!scraperUser) {
            scraperUser = await User.create({
                username: "NewsBot",
                email: "bot@newsroom.edu",
                password: "hashedpassword123",
                role: "writer"
            });
        }

        const campusStories = [
            {
                title: "University Announces Comprehensive Renovation of Historic Main Library",
                category: "campus",
                coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
                content: "<p>The administration has officially unveiled the blueprints for a massive $12 million overhaul of the historic Main Library. Slated to begin next semester, the project will add over 50,000 square feet of collaborative study spaces, a brand-new 24/7 cafe, and state-of-the-art VR research labs.</p><br><p>Dean of Students remarked, 'This library will no longer just be a repository of books; it will be the living, breathing heart of our academic community.'</p>"
            },
            {
                title: "Student Developers Win National Hackathon with AI Accessibility Tool",
                category: "tech",
                coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
                content: "<p>A team of four senior computer science majors has brought home the grand prize from this year's National Innovators Hackathon. Their application leverages advanced machine learning to provide real-time, highly accurate physical environment descriptions for visually impaired students navigating complex campus architectures.</p>"
            },
            {
                title: "Annual Spring Festival Lineup Revealed: Local Indie Bands to Headline",
                category: "culture",
                coverImage: "https://images.unsplash.com/photo-1540039155732-d68886a87754?w=800&q=80",
                content: "<p>The Campus Activities Board dropped the much-anticipated setlist for the 2026 Spring Festival. Foregoing mainstream pop acts this year, the committee has decided to spotlight our city's thriving underground indie music scene, accompanied by local food trucks and student art exhibits.</p>"
            },
            {
                title: "New AI Integrity Policy Leaves Faculty and Students Divided",
                category: "academics",
                coverImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
                content: "<p>The Provost's office issued a sweeping new policy classifying unauthorized generative AI usage under the same severe academic dishonesty rubrics as plagiarism. While traditionalist professors herald the move as a defense of original thought, student unions argue the policy is overly draconian and fails to recognize AI as the new calculator.</p>"
            },
            {
                title: "Varsity Basketball Team Secures Historic Regional Championship",
                category: "sports",
                coverImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
                content: "<p>In a nail-biting overtime thriller, our varsity basketball team outscored their cross-town rivals by a single point, securing their first regional championship title in over two decades. The campus erupted in celebration, with spontaneous parades marching through the quad well into the night.</p>"
            }
        ];

        let insertedCount = 0;
        for (const story of campusStories) {
            const exists = await Article.findOne({ title: story.title });
            if (!exists) {
                await Article.create({
                    ...story,
                    status: "published",
                    author: scraperUser._id
                });
                insertedCount++;
            }
        }

        return NextResponse.json({ message: \`Success. Inserted \${insertedCount} new campus-centric articles.\` }, { status: 200 });

    } catch (error: any) {
        console.error("Seed Error:", error);
        return NextResponse.json({ message: "Seed Failed", error: error.message }, { status: 500 });
    }
}
