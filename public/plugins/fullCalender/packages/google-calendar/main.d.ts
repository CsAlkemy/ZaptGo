// Generated by dts-bundle v0.7.3-fork.1
// Dependencies for this module:
//   main.d.ts

declare module '@fullcalendar/google-calendar' {
    module '@fullcalendar/core' {
        interface OptionsInput {
            googleCalendarApiKey?: string;
        }
    }
    module '@fullcalendar/core/structs/event-source' {
        interface ExtendedEventSourceInput {
            googleCalendarApiKey?: string;
            googleCalendarId?: string;
        }
    }
    const _default: import("@fullcalendar/Core").PluginDef;
    export default _default;
}

