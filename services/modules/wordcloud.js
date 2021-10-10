import {Canvas} from 'canvas';
import cloud from 'd3-cloud';
import fs from 'fs';

import Trends from '../../db/trends';

export async function getMonthlyWordCloud() {
    let trends = await Trends.findOne({month: Trends.getMonthKey()}).exec();
    
    let words = trends.trends.map((word, index) => {
      return {text: word, size: 100 - index * 3};
    });

    cloud().size([640, 400])
        .canvas(function() { return new Canvas(1, 1); })
        .words(words)
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", end)
        .start();
}

function end(words, bounds) { 
    let w = bounds[1].x - bounds[0].x;
	let h = bounds[1].y - bounds[0].y;

	let canvas = new Canvas(w, h);
	let ctx = canvas.getContext('2d');
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
    ctx.translate(w/2, h/2);
    ctx.translate(-bounds[0].x, -bounds[0].y);
	for (let i=0; i < words.length; i++) {
		let w = words[i];
		ctx.font = `${w.size}px ${w.font}`;
        ctx.fillStyle = "#" + Math.round(Math.random() * 0xffffff).toString(16);
        ctx.save();
        ctx.translate(w.x, w.y);
        ctx.rotate((w.rotate * Math.PI) / 180);
        ctx.fillText(w.text, 0, 0);
        ctx.restore();
	}
	fs.writeFileSync(`wordcloud/${Trends.getMonthKey()}.png`, canvas.toBuffer());
} 