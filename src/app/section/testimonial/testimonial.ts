import { Component } from '@angular/core';
import { NgFor, NgClass } from '@angular/common'; 

@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './testimonial.html',
  styleUrls: ['./testimonial.scss'],
})
export class Testimonial {
  currentIndex = 0;

  testimonials = [
    {
      quote:
        'We\'ve hopped between three different math curricula in three years, and nothing seemed to stick.  My son was still frustrated and tuning out during lessons. LABWay Math was a game-changer because it lets you keep your existing curriculum but teaches you how to unlock it with powerful underlying logic and Socratic dialogues that make math discovery fun. No joke. My son thinks it’s fun! The UCL Library is packed with insights I wish I\'d known sooner. After the pilot, our math time feels connected and exciting, not like a battle.',
      name: 'Emily',
      avatar: 'assets/avatars/a1.jpg',
    },
    { 
      quote: 'I was so determined to homeschool math myself, but no matter what I tried, my daughter just wasn\'t interested.  She\'d zone out or get frustrated, and I\'d end up feeling defeated too. LABWay Math\'s approach to real math conversations flipped the script.  Their training showed me how to use a clear algorithm for Socratic questions so she could discover concepts herself, sparking genuine excitement. The live sessions and videos made it easy to practice, and now she\'s developing critical thinking skills that go way beyond math. We\'ve stuck with our curriculum, but everything makes sense now. The implementation support after training sealed the deal for us.',
      name: 'Jessica',
      avatar: 'assets/avatars/a2.jpg',
    },
    {
      quote: 'My kids were doing okay in math, passing tests and all, but I knew there had to be more.  They weren\'t truly understanding or loving it, just going through the motions. Enrolling in LABWay Math\'s pilot opened our eyes to the underlying logic of math, and the Socratic methods helped them discover ideas in a way that built real confidence and connection. The UCL Library and how-to videos are fantastic resources we revisit often. Now, math day is a good day. It’s even fostering critical thinking I see spilling into other subjects too.',
      name: 'Megan',
      avatar: 'assets/avatars/a3.jpg',
    },
    {
      quote: 'I just wanted math careers to be an option for my kids.  Even if it meant pushing through my own uncertainties as a homeschool mom. LABWay Math delivered exactly what we needed: training to have those deep, discovery-based conversations using their Socratic algorithm, all while keeping our trusted curriculum intact. The 24 hours of live training transformed how we approach math, unlocking pre-algebra and beyond with the UCL insights that make procedures meaningful. Post-training support ensured we implemented it smoothly, and I\'ve seen my kids\' critical thinking soar. This program made my son start to think he IS a “math person"',
      name: 'Laura',
      avatar: 'assets/avatars/a4.jpg',
    },
    {
      quote: 'I was terrified of tackling higher math with my kids because I barely scraped by in algebra myself back in school.  Privately, I felt like a fraud trying to homeschool them through it. But LABWay Math changed everything by training me on the underlying logic of math concepts in a way that made sense even to me, and their Socratic conversation techniques gave me the tools to guide my children without needing to be a math whiz. The 24 hours of live training and example conversations were lifesavers, building my confidence step by step. Now, we\'re having real math discussions where my kids discover the logic of math, and I\'m no longer left behind feeling inadequate. I can\'t recommend this enough for moms like me who doubted their own abilities!',
      name: 'Sarah',
      avatar: 'assets/avatars/a5.jpg',
    },
  ];

  next() {
    this.currentIndex =
      (this.currentIndex + 1) % this.testimonials.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.testimonials.length) %
      this.testimonials.length;
  }

  goTo(index: number) {
    this.currentIndex = index;
  }
}
