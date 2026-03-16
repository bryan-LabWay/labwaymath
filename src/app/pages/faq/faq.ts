import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';

type FaqListItem = {
  title: string;
  text: string;
  subItems?: string[];
};

type FaqBlock = {
  kind: 'paragraph' | 'list';
  text?: string;
  intro?: string;
  items?: FaqListItem[];
};

type FaqEntry = {
  question: string;
  blocks: FaqBlock[];
};

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly faqs: FaqEntry[] = [
    {
      question: 'Who is LABWay Math For?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            "LABWay Math is designed primarily for homeschool parents teaching children roughly ages 5 to 15. It is especially valuable for families trying to understand why a child is struggling with math, resisting it, or memorizing procedures without really understanding what they mean.",
        },
        {
          kind: 'paragraph',
          text:
            "It also helps children who appear to do well intuitively. LABWay Math helps turn that subconscious grasp into clear, expressible understanding, which becomes increasingly important as students move into algebra, trigonometry, and more independent problem solving.",
        },
        {
          kind: 'paragraph',
          text:
            "Parents do not need to be math experts. The method is built for parents who may feel unsure about math themselves but still want to give their children a strong, meaningful foundation. There are no prerequisites beyond openness and a willingness to learn.",
        },
        {
          kind: 'paragraph',
          text:
            "The methodology was developed by LABWay LLC, a U.S.-based education company co-founded by leadership with decades of experience in cognitive psychology, corporate learning and development, and hands-on homeschooling. It has been tested with thousands of students in APEC high schools in Southeast Asia and refined through years of family use.",
        },
      ],
    },
    {
      question: 'What is LABWay Math?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            "LABWay Math is a training program for homeschool parents that helps them become more effective math teachers at home. It is a coaching methodology, not a full curriculum, and it works alongside the curriculum a family already uses.",
        },
        {
          kind: 'paragraph',
          text:
            'The core goal is to make math make sense by prioritizing understanding before procedures. Instead of starting with rules to memorize, LABWay Math starts with the logic behind mathematical ideas so children can connect symbols, operations, and methods to real meaning.',
        },
        {
          kind: 'list',
          intro: 'Key components include:',
          items: [
            {
              title: 'Lb4P (Logic before Procedure)',
              text:
                'The foundational principle: discover the true meaning of a math concept before teaching the steps or rules attached to it.',
            },
            {
              title: 'UCLs (Universal Critical Logics)',
              text:
                'The essential truths about math elements that are often skipped in conventional teaching.',
            },
            {
              title: 'CPA+ (Concrete, Pictorial, Story, Abstract)',
              text:
                'A flexible way to move from real-world examples toward symbols. At least one concrete, pictorial, or story-based representation comes before abstract notation, but the order is adapted to the learner.',
            },
            {
              title: 'Socratic Method',
              text:
                'A questioning style that guides children to discover the logic themselves instead of being lectured through it.',
            },
            {
              title: 'IS Sessions',
              text:
                'Short, structured conversations focused on discovering what a math thing or action truly is before building skill with it.',
            },
            {
              title: 'Functionality, Fluency, and Flexibility Sessions',
              text:
                'After logic is clear, these sessions connect that logic to procedures, deepen skill through practice, and build the ability to apply ideas in new contexts.',
            },
            {
              title: 'Algorithm A',
              text:
                'The overall sequence: start with IS sessions for logic discovery, then move into Functionality, Fluency, and Flexibility.',
            },
            {
              title: 'Algorithm B',
              text:
                'A step-by-step flow for running IS sessions, with versions for younger learners building from scratch and older learners recovering missed foundations.',
            },
            {
              title: 'Fallacies Addressed',
              text:
                'The method directly counters the common mistake of presenting math as disconnected abstractions that students can only survive by memorizing.',
            },
          ],
        },
        {
          kind: 'paragraph',
          text:
            'The parent training itself runs for 24 hours over 2 weeks. It includes the process, the Socratic method, a library of sample UCLs and dialogues, and practice in small groups so parents can integrate the method into their existing homeschool routines.',
        },
      ],
    },
    {
      question: 'Where is LABWay Math Applied?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'LABWay Math is tailored for homeschool environments, where parents can give one-on-one or small-group attention that would be too resource-intensive in a traditional classroom.',
        },
        {
          kind: 'paragraph',
          text:
            'Although the methodology grew out of work connected to schools in Southeast Asia, it has been adapted specifically for U.S. homeschooling and can be used by homeschool families worldwide.',
        },
        {
          kind: 'paragraph',
          text:
            'In practice, sessions happen at home during regular math time and use ordinary household objects, drawings, and stories. No special tools are required beyond a willingness to re-learn math through a more logical lens.',
        },
      ],
    },
    {
      question: 'When is LABWay Math Used?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'The parent training is delivered in a compact 24-hour format over 2 weeks, which makes it manageable for busy homeschool families.',
        },
        {
          kind: 'paragraph',
          text:
            'After training, parents apply the method during regular math lessons by inserting IS sessions and reviews before or alongside curriculum lessons whenever a new concept needs logical grounding.',
        },
        {
          kind: 'paragraph',
          text:
            'For younger children, the method is woven in gradually over time so understanding is built from the ground up. For older learners, parents may pause the standard curriculum for a recovery phase that revisits missed foundations before returning to more advanced work.',
        },
      ],
    },
    {
      question: 'Why Does LABWay Math Exist?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'LABWay Math exists because math is often taught as abstractions, rules, tricks, and procedures without explaining why they make sense. That leaves many students either barely holding things together through memorization or openly frustrated and discouraged.',
        },
        {
          kind: 'paragraph',
          text:
            'The method addresses that problem by building logical understanding first. Instead of asking students to trust arbitrary steps, it helps them connect math to meaning so they can appreciate it, use it independently, and stay confident as topics become harder.',
        },
        {
          kind: 'paragraph',
          text:
            'It also gives parents a practical way to take ownership of math education in the home. The long-term goal is not just better grades, but children who become comfortable, capable, and independent in math.',
        },
      ],
    },
    {
      question: 'How Does LABWay Math Work?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Parents begin with the 24-hour training program, which teaches the methodology and often rebuilds the parents\' own relationship with math at the same time. During training, parents practice in small groups and can continue to receive support from LABWay afterward.',
        },
        {
          kind: 'paragraph',
          text:
            'For younger learners, parents weave short IS sessions into the curriculum before introducing each new concept. Those discoveries then anchor the child\'s progress through the regular curriculum\'s procedures, practice, and more advanced applications.',
        },
        {
          kind: 'paragraph',
          text:
            'For older learners, parents usually pause the standard curriculum for 2 to 12 months and guide the child through a targeted recovery of foundational pre-algebra ideas. That work reconnects missed logic to the procedures the student has already seen, which often transforms the child\'s relationship with math.',
        },
        {
          kind: 'paragraph',
          text:
            'Throughout the process, parents use everyday examples, drawings, stories, and Socratic questioning to help children discover the logic for themselves and then connect it back to abstract symbols in the curriculum they already use.',
        },
      ],
    },
  ];

  trackByQuestion(_index: number, faq: FaqEntry) {
    return faq.question;
  }

  faqNumber(index: number) {
    return `${index + 1}`.padStart(2, '0');
  }

  onFaqToggle(event: Event) {
    if (!this.isBrowser) {
      return;
    }

    const faqItem = event.currentTarget as HTMLDetailsElement | null;
    if (!faqItem) {
      return;
    }

    window.setTimeout(() => {
      faqItem.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }, faqItem.open ? 120 : 0);
  }
}
