package com.ivion.main.util;

import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;

public final class SanitizationUtil {

    private static final PolicyFactory STRIP_ALL = new HtmlPolicyBuilder().toFactory();

    private SanitizationUtil() {}

    public static String sanitize(String input) {
        if (input == null) return null;
        return STRIP_ALL.sanitize(input);
    }
}
