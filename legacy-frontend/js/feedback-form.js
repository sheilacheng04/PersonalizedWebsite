// ============================================================================
// SUPABASE CONFIGURATION & INITIALIZATION
// ============================================================================
// 1. We import Supabase instead of Firebase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 2. PASTE YOUR KEYS HERE (Get these from Supabase Settings -> API)
const supabaseUrl = 'https://wcgkeofwjtgqlbrjprwy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZ2tlb2Z3anRncWxicmpwcnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4ODY1MjAsImV4cCI6MjA4NjQ2MjUyMH0.bkp3tZnDz9ikDM-9jsQfOnR74JMBH0J63Absvm-m0QY'

const supabase = createClient(supabaseUrl, supabaseKey)

// ============================================================================
// FEEDBACK CIRCLES SYSTEM (Physics Logic - UNCHANGED)
// ============================================================================

class FeedbackCircles {
    constructor() {
        this.container = document.querySelector('.feedback-circles-container');
        this.form = document.querySelector('.feedback-form');
        this.feedbackData = [];
        this.circles = [];
        this.draggingCircle = null;
        this.dragOffset = { x: 0, y: 0 };
        this.init();
    }

    init() {
        if (!this.container) return;
        this.setupDragListeners();
        this.startPhysicsLoop();
        window.feedbackCirclesInstance = this;
    }

    setupDragListeners() {
        this.container.addEventListener('mousedown', (e) => this.handleDragStart(e));
        document.addEventListener('mousemove', (e) => this.handleDragMove(e));
        document.addEventListener('mouseup', () => this.handleDragEnd());
        this.container.addEventListener('touchstart', (e) => this.handleDragStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.handleDragMove(e), { passive: false });
        document.addEventListener('touchend', () => this.handleDragEnd());
    }

    handleDragStart(e) {
        const target = e.target.closest('.feedback-circle');
        if (!target) return;
        e.preventDefault();
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        const rect = target.getBoundingClientRect();
        this.dragOffset = {
            x: clientX - rect.left - rect.width / 2,
            y: clientY - rect.top - rect.height / 2
        };
        this.draggingCircle = target;
        target.classList.add('dragging');
        target.style.animationPlayState = 'paused';
        const circleData = this.circles.find(c => c.element === target);
        if (circleData) {
            circleData.lastX = rect.left + rect.width / 2;
            circleData.lastY = rect.top + rect.height / 2;
            circleData.velocityX = 0;
            circleData.velocityY = 0;
        }
    }

    handleDragMove(e) {
        if (!this.draggingCircle) return;
        e.preventDefault();
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        const containerRect = this.container.getBoundingClientRect();
        const circleRect = this.draggingCircle.getBoundingClientRect();
        let newX = clientX - containerRect.left - this.dragOffset.x;
        let newY = clientY - containerRect.top - this.dragOffset.y;
        const radius = circleRect.width / 2;
        newX = Math.max(radius, Math.min(containerRect.width - radius, newX));
        newY = Math.max(radius, Math.min(containerRect.height - radius, newY));
        this.draggingCircle.style.left = newX + 'px';
        this.draggingCircle.style.top = newY + 'px';
        this.draggingCircle.style.transform = 'none';
        const circleData = this.circles.find(c => c.element === this.draggingCircle);
        if (circleData && circleData.lastX !== undefined) {
            circleData.velocityX = newX - circleData.lastX;
            circleData.velocityY = newY - circleData.lastY;
            circleData.lastX = newX;
            circleData.lastY = newY;
        }
        this.checkCollisions(this.draggingCircle, newX, newY);
    }

    handleDragEnd() {
        if (!this.draggingCircle) return;
        this.draggingCircle.classList.remove('dragging');
        setTimeout(() => {
            if (this.draggingCircle) {
                this.draggingCircle.style.animationPlayState = 'running';
            }
        }, 1000);
        this.draggingCircle = null;
    }

    checkCollisions(draggedCircle, dragX, dragY) {
        const circles = Array.from(this.container.querySelectorAll('.feedback-circle'));
        const radius = 40;
        const influenceRadius = 150;
        circles.forEach(otherCircle => {
            if (otherCircle === draggedCircle) return;
            const rect = otherCircle.getBoundingClientRect();
            const containerRect = this.container.getBoundingClientRect();
            const otherX = rect.left + rect.width / 2 - containerRect.left;
            const otherY = rect.top + rect.height / 2 - containerRect.top;
            const dx = dragX - otherX;
            const dy = dragY - otherY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < influenceRadius && distance > 0) {
                const angle = Math.atan2(-dy, -dx);
                const distanceRatio = 1 - (distance / influenceRadius);
                const pushForce = distanceRatio * distanceRatio * 8;
                const pushX = Math.cos(angle) * pushForce;
                const pushY = Math.sin(angle) * pushForce;
                const circleData = this.circles.find(c => c.element === otherCircle);
                if (circleData) {
                    circleData.velocityX = (circleData.velocityX || 0) + pushX;
                    circleData.velocityY = (circleData.velocityY || 0) + pushY;
                }
                const currentTransform = otherCircle.style.transform || 'translate(0, 0)';
                const translateMatch = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                let currentX = 0, currentY = 0;
                if (translateMatch) {
                    currentX = parseFloat(translateMatch[1]) || 0;
                    currentY = parseFloat(translateMatch[2]) || 0;
                }
                const newX = currentX + pushX;
                const newY = currentY + pushY;
                const maxX = containerRect.width - radius * 2;
                const maxY = containerRect.height - radius * 2;
                const boundedX = Math.max(-otherX + radius, Math.min(maxX - otherX + radius, newX));
                const boundedY = Math.max(-otherY + radius, Math.min(maxY - otherY + radius, newY));
                otherCircle.style.transition = 'transform 0.15s ease-out';
                otherCircle.style.transform = `translate(${boundedX}px, ${boundedY}px)`;
                const intensity = distanceRatio * 0.8;
                otherCircle.style.borderColor = `rgba(100, 180, 255, ${0.4 + intensity * 0.4})`;
                otherCircle.style.background = `rgba(100, 180, 255, ${0.15 + intensity * 0.15})`;
                if (distance > influenceRadius * 0.9) {
                    setTimeout(() => {
                        otherCircle.style.borderColor = '';
                        otherCircle.style.background = '';
                    }, 200);
                }
            } else {
                otherCircle.style.borderColor = '';
                otherCircle.style.background = '';
            }
        });
    }

    startPhysicsLoop() {
        setInterval(() => {
            this.circles.forEach(circleData => {
                if (circleData.element === this.draggingCircle) return;
                if (!circleData.velocityX && !circleData.velocityY) return;
                circleData.velocityX *= 0.92;
                circleData.velocityY *= 0.92;
                if (Math.abs(circleData.velocityX) < 0.05) circleData.velocityX = 0;
                if (Math.abs(circleData.velocityY) < 0.05) circleData.velocityY = 0;
            });
        }, 30);
    }

    createFeedbackCircle(feedback) {
        const circle = document.createElement('div');
        circle.className = 'feedback-circle';
        const nameEl = document.createElement('div');
        nameEl.className = 'feedback-circle-name';
        nameEl.textContent = feedback.name;
        const messageEl = document.createElement('div');
        messageEl.className = 'feedback-circle-message';
        messageEl.textContent = feedback.message;
        circle.appendChild(nameEl);
        circle.appendChild(messageEl);
        const circleData = {
            element: circle,
            feedback: feedback,
            velocityX: 0,
            velocityY: 0
        };
        this.circles.push(circleData);
        circle.addEventListener('click', (e) => {
            if (!circle.classList.contains('dragging')) {
                this.showFullFeedback(feedback);
            }
        });
        this.container.appendChild(circle);
        circle.style.opacity = '0';
        circle.style.transform = 'scale(0)';
        setTimeout(() => {
            circle.style.transition = 'all 0.5s ease';
            circle.style.opacity = '1';
            circle.style.transform = 'scale(1)';
        }, 100);
    }

    showFullFeedback(feedback) {
        const modal = document.createElement('div');
        modal.className = 'feedback-modal';
        modal.innerHTML = `
            <div class="feedback-modal-content">
                <button class="feedback-modal-close">&times;</button>
                <h3>${feedback.name}</h3>
                <p class="feedback-modal-email">${feedback.email}</p>
                <p class="feedback-modal-message">${feedback.message}</p>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('feedback-modal-close')) {
                modal.remove();
            }
        });
    }

    loadExistingFeedback(feedbackArray) {
        feedbackArray.forEach(feedback => {
            this.createFeedbackCircle(feedback);
        });
    }
}

// ============================================================================
// SUPABASE & VUE.JS FORM SETUP
// ============================================================================

const { createApp } = Vue;

let feedbackCircles;

createApp({
    data() {
        return {
            form: {
                name: '',
                email: '',
                message: ''
            },
            isSubmitting: false,
            successMessage: '',
            errorMessage: ''
        };
    },
    methods: {
        async submitForm() {
            this.isSubmitting = true;
            this.successMessage = '';
            this.errorMessage = '';

            try {
                // 3. Prepare data for Supabase
                const feedbackData = {
                    name: this.form.name,
                    email: this.form.email,
                    message: this.form.message,
                    // Supabase adds the 'created_at' automatically, so we don't strictly need timestamp here
                    // but we can pass it if we want to use it immediately in the UI
                };
                
                // 4. Send data to Supabase (Replaces addDoc)
                const { data, error } = await supabase
                    .from('feedback')
                    .insert([feedbackData])
                    .select(); // .select() returns the data we just saved

                if (error) throw error;
                
                // 5. Update UI
                if (feedbackCircles) {
                    feedbackCircles.createFeedbackCircle(feedbackData);
                }
                
                this.successMessage = 'Your message has been sent! Thanks for reaching out.';
                this.form = { name: '', email: '', message: '' };
                
                setTimeout(() => {
                    this.successMessage = '';
                }, 4000);
            } catch (error) {
                this.errorMessage = 'Failed to send message. Please try again.';
                console.error('Form submission error:', error);
            } finally {
                this.isSubmitting = false;
            }
        }
    }
}).mount('#app-feedback-form');

// ============================================================================
// INITIALIZATION
// ============================================================================

async function initializeFeedback() {
    feedbackCircles = new FeedbackCircles();
    
    // 6. Load data from Supabase (Replaces getDocs/query)
    try {
        const { data: feedbackArray, error } = await supabase
            .from('feedback')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (feedbackCircles && feedbackArray.length > 0) {
            feedbackCircles.loadExistingFeedback(feedbackArray);
        }
    } catch (error) {
        console.error('Error loading feedback:', error);
    }
}

document.addEventListener('DOMContentLoaded', initializeFeedback);