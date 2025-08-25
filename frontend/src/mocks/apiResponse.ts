import { Deadline } from "../types";

export const mockApiResponse2: Deadline[] = [
    {
        id: "1",
        name: "Project Proposal",
        date: "2023-10-15",
        description: "Submit the initial project proposal document.",
        highlight: {
            content: {
                text: " Proposal is due on 2023-10-15",
            },
            position: {
                boundingRect: {
                    x1: 255.73419189453125,
                    y1: 139.140625,
                    x2: 574.372314453125,
                    y2: 165.140625,
                    width: 809.9999999999999,
                    height: 1200,
                },
                rects: [
                    {
                        x1: 255.73419189453125,
                        y1: 139.140625,
                        x2: 574.372314453125,
                        y2: 165.140625,
                        width: 809.9999999999999,
                        height: 1200,
                    },
                ],
                pageNumber: 1,
            },
            comment: {
                text: " Proposal is due on 2023-10-15",
                emoji: "🔥",
            },
            id: "8245652131754351",
        }
    },
    {
        id: "2",
        name: "Midterm Report",
        date: "2023-11-30",
        highlight: {
            content: {
                text: "Midterm Report is due on 2023-11-30",
            },
            position: {
                boundingRect: {
                    x1: 816.4599609375,
                    y1: 360.1875,
                    x2: 848.4677734375,
                    y2: 380.1875,
                    width: 1019.9999999999999,
                    height: 1319.9999999999998,
                    pageNumber: 1,
                },
                rects: [
                    {
                        x1: 816.4599609375,
                        y1: 360.1875,
                        x2: 848.4677734375,
                        y2: 380.1875,
                        width: 1019.9999999999999,
                        height: 1319.9999999999998,
                        pageNumber: 1,
                    },
                ],
                pageNumber: 1,
            },
            comment: {
                text: "Midterm Report is due on 2023-11-30",
                emoji: "😎",
            },
            id: "29668244118038056",
        }
    }
]


export const mockApiResponse: Deadline[] = [
    {
        date: "2023-10-15",
        id: "1",
        name: "Project Proposal",
        highlight: {
            id: "1",
            comment: {
                emoji: '',
                text: "In this paper we",
            },
            content: {
                "text": "In this paper we",
            },
            "position": {
                "boundingRect": {
                    "x1": 45.827999114990234,
                    "y1": 197.7198028564453,
                    "x2": 103.40967559814453,
                    "y2": 206.59608459472656,
                    "width": 486.0,
                    "height": 720.0
                },
                "rects": [
                    {
                        "x1": 45.827999114990234,
                        "y1": 197.7198028564453,
                        "x2": 103.40967559814453,
                        "y2": 206.59608459472656,
                        "width": 486.0,
                        "height": 720.0
                    }
                ],
                "pageNumber": 1
            },
        }
    }
]