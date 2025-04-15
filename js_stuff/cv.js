"use strict";
// Generate a CV
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var docx_1 = require("docx");
// tslint:disable:no-shadowed-variable
var PHONE_NUMBER = "07534563401";
var PROFILE_URL = "https://www.linkedin.com/in/dolan1";
var EMAIL = "docx@com";
var experiences = [
    {
        isCurrent: true,
        summary: "Full-stack developer working with Angular and Java. Working for the iShares platform",
        title: "Associate Software Developer",
        startDate: {
            month: 11,
            year: 2017,
        },
        company: {
            name: "BlackRock",
        },
    },
    {
        isCurrent: false,
        summary: "Full-stack developer working with Angular, Node and TypeScript. Working for the iShares platform. Emphasis on Dev-ops and developing the continuous integration pipeline.",
        title: "Software Developer",
        endDate: {
            month: 11,
            year: 2017,
        },
        startDate: {
            month: 10,
            year: 2016,
        },
        company: {
            name: "Torch Markets",
        },
    },
    {
        isCurrent: false,
        summary: "Used ASP.NET MVC 5 to produce a diversity data collection tool for the future of British television.\n\nUsed AngularJS and C# best practices. Technologies used include JavaScript, ASP.NET MVC 5, SQL, Oracle, SASS, Bootstrap, Grunt.",
        title: "Software Developer",
        endDate: {
            month: 10,
            year: 2016,
        },
        startDate: {
            month: 3,
            year: 2015,
        },
        company: {
            name: "Soundmouse",
        },
    },
    {
        isCurrent: false,
        summary: 
        // cspell:disable-next-line
        "Develop web commerce platforms for various high profile clients.\n\nCreated a log analysis web application with the Play Framework in Java, incorporating Test Driven Development. It asynchronously uploads and processes large (2 GB) log files, and outputs meaningful results in context with the problem. \n\nAnalysis  and  development  of  the payment system infrastructure and user accounts section to be used by several clients of the company such as Waitrose, Tally Weijl, DJ Sports, Debenhams, Ann Summers, John Lewis and others.\n\nTechnologies used include WebSphere Commerce, Java, JavaScript and JSP.",
        title: "Java Developer",
        endDate: {
            month: 10,
            year: 2014,
        },
        startDate: {
            month: 3,
            year: 2013,
        },
        company: {
            name: "Soundmouse",
        },
    },
];
var education = [
    {
        degree: "Master of Science (MSc)",
        fieldOfStudy: "Computer Science",
        notes: "Exam Results: 1st Class with Distinction, Dissertation: 1st Class with Distinction\n\nRelevant Courses: Java and C# Programming, Software Engineering, Artificial Intelligence, \nComputational Photography, Algorithms, Architecture and Hardware.\n\nCreated a Windows 8 game in JavaScript for the dissertation. \n\nCreated an award-winning 3D stereoscopic game in C# using XNA.",
        schoolName: "University College London",
        startDate: {
            year: 2012,
        },
        endDate: {
            year: 2013,
        },
    },
    {
        degree: "Bachelor of Engineering (BEng)",
        fieldOfStudy: "Material Science and Engineering",
        notes: "Exam Results: 2:1, Dissertation: 1st Class with Distinction\n\nRelevant courses: C Programming, Mathematics and Business for Engineers.",
        schoolName: "Imperial College London",
        startDate: {
            year: 2009,
        },
        endDate: {
            year: 2012,
        },
    },
];
var skills = [
    {
        name: "Angular",
    },
    {
        name: "TypeScript",
    },
    {
        name: "JavaScript",
    },
    {
        name: "NodeJS",
    },
];
var achievements = [
    {
        issuer: "Oracle",
        name: "Oracle Certified Expert",
    },
];
var DocumentCreator = /** @class */ (function () {
    function DocumentCreator() {
    }
    // tslint:disable-next-line: typedef
    DocumentCreator.prototype.create = function (_a) {
        var _this = this;
        var experiences = _a[0], educations = _a[1], skills = _a[2], achievements = _a[3];
        var document = new docx_1.Document({
            sections: [
                {
                    children: __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([
                        new docx_1.Paragraph({
                            text: "Dolan Miu",
                            heading: docx_1.HeadingLevel.TITLE,
                        }),
                        this.createContactInfo(PHONE_NUMBER, PROFILE_URL, EMAIL),
                        this.createHeading("Education")
                    ], educations
                        .map(function (education) {
                        var arr = [];
                        arr.push(_this.createInstitutionHeader(education.schoolName, "".concat(education.startDate.year, " - ").concat(education.endDate.year)));
                        arr.push(_this.createRoleText("".concat(education.fieldOfStudy, " - ").concat(education.degree)));
                        var bulletPoints = _this.splitParagraphIntoBullets(education.notes);
                        bulletPoints.forEach(function (bulletPoint) {
                            arr.push(_this.createBullet(bulletPoint));
                        });
                        return arr;
                    })
                        .reduce(function (prev, curr) { return prev.concat(curr); }, []), true), [
                        this.createHeading("Experience")
                    ], false), experiences
                        .map(function (position) {
                        var arr = [];
                        arr.push(_this.createInstitutionHeader(position.company.name, _this.createPositionDateText(position.startDate, position.endDate, position.isCurrent)));
                        arr.push(_this.createRoleText(position.title));
                        var bulletPoints = _this.splitParagraphIntoBullets(position.summary);
                        bulletPoints.forEach(function (bulletPoint) {
                            arr.push(_this.createBullet(bulletPoint));
                        });
                        return arr;
                    })
                        .reduce(function (prev, curr) { return prev.concat(curr); }, []), true), [
                        this.createHeading("Skills, Achievements and Interests"),
                        this.createSubHeading("Skills"),
                        this.createSkillList(skills),
                        this.createSubHeading("Achievements")
                    ], false), this.createAchievementsList(achievements), true), [
                        this.createSubHeading("Interests"),
                        this.createInterests("Programming, Technology, Music Production, Web Design, 3D Modelling, Dancing."),
                        this.createHeading("References"),
                        new docx_1.Paragraph("Dr. Dean Mohamedally Director of Postgraduate Studies Department of Computer Science, University College London Malet Place, Bloomsbury, London WC1E d.mohamedally@ucl.ac.uk"),
                        new docx_1.Paragraph("More references upon request"),
                        new docx_1.Paragraph({
                            text: "This CV was generated in real-time based on my Linked-In profile from my personal website www.dolan.bio.",
                            alignment: docx_1.AlignmentType.CENTER,
                        }),
                    ], false),
                },
            ],
        });
        return document;
    };
    DocumentCreator.prototype.createContactInfo = function (phoneNumber, profileUrl, email) {
        return new docx_1.Paragraph({
            alignment: docx_1.AlignmentType.CENTER,
            children: [
                new docx_1.TextRun("Mobile: ".concat(phoneNumber, " | LinkedIn: ").concat(profileUrl, " | Email: ").concat(email)),
                new docx_1.TextRun({
                    text: "Address: 58 Elm Avenue, Kent ME4 6ER, UK",
                    break: 1,
                }),
            ],
        });
    };
    DocumentCreator.prototype.createHeading = function (text) {
        return new docx_1.Paragraph({
            text: text,
            heading: docx_1.HeadingLevel.HEADING_1,
            thematicBreak: true,
        });
    };
    DocumentCreator.prototype.createSubHeading = function (text) {
        return new docx_1.Paragraph({
            text: text,
            heading: docx_1.HeadingLevel.HEADING_2,
        });
    };
    DocumentCreator.prototype.createInstitutionHeader = function (institutionName, dateText) {
        return new docx_1.Paragraph({
            tabStops: [
                {
                    type: docx_1.TabStopType.RIGHT,
                    position: docx_1.TabStopPosition.MAX,
                },
            ],
            children: [
                new docx_1.TextRun({
                    text: institutionName,
                    bold: true,
                }),
                new docx_1.TextRun({
                    children: [new docx_1.Tab(), dateText],
                    bold: true,
                }),
            ],
        });
    };
    DocumentCreator.prototype.createRoleText = function (roleText) {
        return new docx_1.Paragraph({
            children: [
                new docx_1.TextRun({
                    text: roleText,
                    italics: true,
                }),
            ],
        });
    };
    DocumentCreator.prototype.createBullet = function (text) {
        return new docx_1.Paragraph({
            text: text,
            bullet: {
                level: 0,
            },
        });
    };
    // tslint:disable-next-line:no-any
    DocumentCreator.prototype.createSkillList = function (skills) {
        return new docx_1.Paragraph({
            children: [new docx_1.TextRun(skills.map(function (skill) { return skill.name; }).join(", ") + ".")],
        });
    };
    // tslint:disable-next-line:no-any
    DocumentCreator.prototype.createAchievementsList = function (achievements) {
        return achievements.map(function (achievement) {
            return new docx_1.Paragraph({
                text: achievement.name,
                bullet: {
                    level: 0,
                },
            });
        });
    };
    DocumentCreator.prototype.createInterests = function (interests) {
        return new docx_1.Paragraph({
            children: [new docx_1.TextRun(interests)],
        });
    };
    DocumentCreator.prototype.splitParagraphIntoBullets = function (text) {
        return text.split("\n\n");
    };
    // tslint:disable-next-line:no-any
    DocumentCreator.prototype.createPositionDateText = function (startDate, endDate, isCurrent) {
        var startDateText = this.getMonthFromInt(startDate.month) + ". " + startDate.year;
        var endDateText = isCurrent ? "Present" : "".concat(this.getMonthFromInt(endDate.month), ". ").concat(endDate.year);
        return "".concat(startDateText, " - ").concat(endDateText);
    };
    DocumentCreator.prototype.getMonthFromInt = function (value) {
        switch (value) {
            case 1:
                return "Jan";
            case 2:
                return "Feb";
            case 3:
                return "Mar";
            case 4:
                return "Apr";
            case 5:
                return "May";
            case 6:
                return "Jun";
            case 7:
                return "Jul";
            case 8:
                return "Aug";
            case 9:
                return "Sept";
            case 10:
                return "Oct";
            case 11:
                return "Nov";
            case 12:
                return "Dec";
            default:
                return "N/A";
        }
    };
    return DocumentCreator;
}());
var documentCreator = new DocumentCreator();
var doc = documentCreator.create([experiences, education, skills, achievements]);
docx_1.Packer.toBuffer(doc).then(function (buffer) {
    fs.writeFileSync("cv.docx", buffer);
});
