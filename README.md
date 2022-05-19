# ClassSchedule

Website that shows my class schedule

This is the first website I have ever built from scratch on my own. The idea is to create a website that allows you to create your class schedule, style your calendar, save old schedule, export schedule as pdf and/or an image file. However, those are the ultimate goal. For this initial state, I only aim to recreate my summer class schedule with Disney's Evil Queen theme that I created using excel.

Progress log:

    5/14/2022:
        - Created the initial website with a simple, incomplete calendar using grid
        - Calendar divided into cells to resemble how the original calendar's division
    5/17/2022:
        - Applied colors and font styles
        - Display course blocks on calendar with hover effects.
        - Issues:
            + child item of one container gets cut of if overlap with the child item of the container to its right. This might or might not only happen when the containers are positioned relative while the children absolute. I ran into this issue trying to create shaddows for the course blocks and expand/translate it when hovering to create a feeling that the block move closer to the screen. When implementing this, the expanded part of the block, including the shadow, would be cut off/covered if overlap with the elements on its right.
        - Fix:
            I created a huge container whose class called main-section. "Main-section" because I figured this calendar may belong to a small section of a multi-sections page as I further develop this website.

            Inside the container, there are 2 elements mimicking each other in terms of grid division. The 1st element is of the class "calendar-container" and is positioned "absolute" in relative to "main-section" container. Meanwhile, the other element of the class "calendar" holds the elements that make up the base decorations of the calendar (excluding the course-blocks).

            The "calendar-container" element is layed on top of the "calendar" one and includes 4 children: time-container, weekday-container, hour-container, and course-container, which are the counterparts of the children under the "calendar" element (named time, weekday, hour, and course respectively).

            I then moved all the course-block elements from the "calendar" element into the "calendar-container" so that they are on top of everything.

            This fixed the issue because all the course-block now placed on top of everything, leaving no chance of being covered/cut off by the children of other elements.

    5/18/2022:
        - Added a footer portion for the calendar that displays 1 online class on the left and classes' actual names on the right.
        - In the future, this footer might have a scroll bar to display more than one online classes if needed, but this is not likely to happen as I do not plan to take more than 1 online class per semester. In addition, CS classes are not likely to be online, so there might not be many options anyways.
        - I added a header and footer tag in the html file, but will need to refer to the Omnifood project to see how those sections of the page are arranged.
        - More rearangements of the elements inside the calendar. For example, the course blocks are now on a third layer of the, which is on top of the shadow layer, which in turn is placed on top of the based layer (where the stripe decorations are).
