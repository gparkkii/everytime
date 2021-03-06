const express = require('express');
const router = express.Router();
const { Board } = require("../models/Board");

//=================================
//             Board
//=================================

router.post('/upload', (req, res) => {
    console.log(req.body);
    const board = new Board(req.body);
    board.save((err, board) => {
        // console.log('err',err);
        // console.log('board',board);
        if (err) return res.json({
            success: false,
            message: err,
        })
        return res.status(200).json({
            success: true
        })
    })
})

// router.post('/getBoard', (req, res) => {
//     const Page = req.body.page;
//     console.log('Page',Page);
//     Board.find()
//         .sort({createdAt: -1})
//         .skip(((Page-1)*5))
//         .limit(5)
//         .populate("userFrom")
//         .exec((err, boards) => {
//             if (err) {
//               return res.status(400).send(err);
//             } else {
//               Board.countDocuments({}, (err, count) => {
//                 console.log(count);
//                 return count;
//               })
//               res.status(200).json({ success: true, boards});
//             }
//         })
// })

router.post('/getBoard', (req, res) => {
    const Page = req.body.page;
    console.log('Page',Page);
    Board.countDocuments({}, (err, count) => {
      if(err) {
        return res.status(400).send(err);
      } else {
        Board.find()
        .sort({createdAt: -1})
        .skip(((Page-1)*5))
        .limit(5)
        .populate("userFrom")
        .exec((err, boards) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, boards, count});
        })
      }
    })
})

router.post('/deleteBoard', (req, res) => {
    Board.findOneAndDelete({ userFrom: req.body.userFrom, _id: req.body.boardFrom })
    .exec((err, result) => {
        console.log(result);
        if(err) return res.status(400).send(err);
        return res.status(200).json({ success: true, result })
    })
})

router.post('/:id', (req, res) => {
    //console.log(req.body);
    Board.findOne({ _id : req.body.boardId }, (err, board) => {
        if(board) return res.json({success: true, board});
        else return res.status(404).json({
            success: false
        })
    })
})


module.exports = router;